/**
 * config.js
 * ---------
 * Central place to configure API endpoints.
 *
 * Switch API_BASE_URL comment when targeting a device:
 *   Browser / iOS simulator  →  http://localhost:5000
 *   Android emulator         →  http://10.0.2.2:5000
 *   Physical device          →  http://<your-local-IP>:5000
 */

export const API_BASE_URL = 'http://localhost:5001';

// ML service (usually not called directly from the frontend)
export const ML_SERVICE_URL = 'http://localhost:5002';
