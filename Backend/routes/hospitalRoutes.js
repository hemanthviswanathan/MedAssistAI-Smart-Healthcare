import express from 'express';
import { addHospital, getNearbyHospitals, getAllHospitals } from '../controllers/hospitalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllHospitals);
router.get('/nearby', getNearbyHospitals);   // ?lat=13.08&lon=80.27&radius=20

// Protected (admin use to seed hospitals)
router.post('/', protect, addHospital);

export default router;
