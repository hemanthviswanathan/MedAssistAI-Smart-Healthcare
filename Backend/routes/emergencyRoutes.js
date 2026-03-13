import express from 'express';
import { reportEmergency } from '../controllers/emergencyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to report emergency, protected by JWT auth
router.post('/', protect, reportEmergency);

export default router;
