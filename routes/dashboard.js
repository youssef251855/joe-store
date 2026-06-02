import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('ADMIN'), getDashboardStats);

export default router;
