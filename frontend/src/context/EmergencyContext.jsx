import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from './AuthContext';

const EmergencyContext = createContext(null);

/**
 * Status flow:
 *   'idle' → 'locating' → 'sending' → 'success' | 'error'
 */
export const EmergencyProvider = ({ children }) => {
    const { token } = useAuth();
    const [status, setStatus] = useState('idle');          // idle | locating | sending | success | error
    const [assignedHospital, setAssignedHospital] = useState(null);  // rank-1 hospital
    const [rankedHospitals, setRankedHospitals] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    /**
     * Get GPS coords → POST /api/emergency → store ranked hospitals.
     * @param {string} severityLevel  low | medium | high | critical
     */
    const triggerSOS = (severityLevel = 'high') => {
        setStatus('locating');
        setAssignedHospital(null);
        setRankedHospitals([]);
        setErrorMsg('');

        if (!navigator.geolocation) {
            setStatus('error');
            setErrorMsg('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setStatus('sending');

                try {
                    const res = await fetch(`${API_BASE_URL}/api/emergency`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ latitude, longitude, severityLevel }),
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.message || 'Emergency report failed.');
                    }

                    const ranked = data.ranked_hospitals ?? [];
                    setRankedHospitals(ranked);
                    setAssignedHospital(ranked[0] ?? null);
                    setStatus('success');
                } catch (err) {
                    setErrorMsg(err.message);
                    setStatus('error');
                }
            },
            (geoErr) => {
                setStatus('error');
                setErrorMsg(`Location error: ${geoErr.message}`);
            },
            { timeout: 10000 }
        );
    };

    const reset = () => {
        setStatus('idle');
        setAssignedHospital(null);
        setRankedHospitals([]);
        setErrorMsg('');
    };

    return (
        <EmergencyContext.Provider value={{
            status, assignedHospital, rankedHospitals, errorMsg,
            triggerSOS, reset,
        }}>
            {children}
        </EmergencyContext.Provider>
    );
};

export const useEmergency = () => useContext(EmergencyContext);
