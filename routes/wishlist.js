import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlist.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:id', removeFromWishlist);

export default router;
