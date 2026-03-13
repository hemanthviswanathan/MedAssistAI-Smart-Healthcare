import Emergency from '../models/Emergency.js';
import Hospital from '../models/Hospital.js';

const ML_SERVICE_URL = 'http://localhost:5002';

// Helper: approximate distance in km using Haversine formula
function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// @desc    Report an emergency and get ranked nearby hospitals
// @route   POST /api/emergency
export const reportEmergency = async (req, res) => {
    const { latitude, longitude, severityLevel } = req.body;

    if (!latitude || !longitude || !severityLevel) {
        return res.status(400).json({ message: 'Please provide latitude, longitude, and severityLevel' });
    }

    try {
        // 1. Save the emergency record
        const emergency = await Emergency.create({
            user: req.user._id,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            severityLevel
        });

        // 2. Query MongoDB for active hospitals within 20 km of the emergency
        const RADIUS_KM = 20;
        const nearbyHospitals = await Hospital.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                    $maxDistance: RADIUS_KM * 1000   // metres
                }
            }
        }).limit(10);

        if (nearbyHospitals.length === 0) {
            return res.status(201).json({
                message: 'Emergency reported successfully',
                emergency,
                ranked_hospitals: [],
                note: 'No hospitals found within 20 km.'
            });
        }

        // 3. Compute distance_km for each hospital from the emergency location
        const hospitalsWithDistance = nearbyHospitals.map(h => ({
            id: h._id.toString(),
            name: h.name,
            distance_km: parseFloat(haversineKm(latitude, longitude, h.location.coordinates[1], h.location.coordinates[0]).toFixed(2)),
            capacity: h.capacity,
            emergency_support: h.emergency_support,
            wait_time_min: h.wait_time_min,
            rating: h.rating,
        }));


        // 4. Call the ML microservice to rank hospitals by suitability
        let rankedHospitals = [];
        try {
            const mlRes = await fetch(`${ML_SERVICE_URL}/predict_rank`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hospitalsWithDistance),
            });
            const mlData = await mlRes.json();
            rankedHospitals = mlData.ranked_hospitals ?? [];
        } catch (mlErr) {
            console.warn('[ml_service] Could not reach ranking service:', mlErr.message);
            // Graceful fallback: return hospitals sorted by raw distance
            rankedHospitals = hospitalsWithDistance.sort((a, b) => a.distance_km - b.distance_km);
        }

        res.status(201).json({
            message: 'Emergency reported successfully',
            emergency,
            ranked_hospitals: rankedHospitals,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
