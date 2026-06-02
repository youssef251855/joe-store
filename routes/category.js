import express from 'express';
import { createCategory, getAllCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize('ADMIN'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('ADMIN'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN'), deleteCategory);

export default router;
