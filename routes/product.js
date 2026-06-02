import express from 'express';
import { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts } from '../controllers/product.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('ADMIN'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('ADMIN'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('ADMIN'), deleteProduct);

export default router;
