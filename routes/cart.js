import express from 'express';
import { addToCart, removeFromCart, updateQuantity, getCart } from '../controllers/cart.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateQuantity);
router.delete('/:id', removeFromCart);

export default router;
