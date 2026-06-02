import express from 'express';
import { addReview, getProductReviews } from '../controllers/review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:productId', getProductReviews);
router.post('/', protect, addReview);

export default router;
