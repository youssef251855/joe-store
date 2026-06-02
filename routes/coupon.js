import express from 'express';
import { createCoupon, validateCoupon } from '../controllers/coupon.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.post('/', protect, authorize('ADMIN'), createCoupon);

export default router;
