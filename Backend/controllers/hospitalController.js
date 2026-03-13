import Hospital from '../models/Hospital.js';

// @desc    Add a new hospital
// @route   POST /api/hospitals
export const addHospital = async (req, res) => {
    const { name, address, latitude, longitude, capacity, emergency_support, wait_time_min, rating, phone } = req.body;

    if (!name || !latitude || !longitude) {
        return res.status(400).json({ message: 'name, latitude, and longitude are required.' });
    }

    try {
        const hospital = await Hospital.create({
            name,
            address,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            capacity,
            emergency_support,
            wait_time_min,
            rating,
            phone
        });

        res.status(201).json({ message: 'Hospital added successfully', hospital });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active hospitals
// @route   GET /api/hospitals
export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({ isActive: true });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get hospitals within a radius (for testing/frontend use)
// @route   GET /api/hospitals/nearby?lat=13.08&lon=80.27&radius=20
export const getNearbyHospitals = async (req, res) => {
    const { lat, lon, radius = 20 } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: 'lat and lon query params are required.' });
    }

    try {
        const hospitals = await Hospital.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
                    $maxDistance: parseFloat(radius) * 1000  // convert km → metres
                }
            }
        }).limit(10);

        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
