import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id/status', authorize('ADMIN'), updateOrderStatus);

export default router;
