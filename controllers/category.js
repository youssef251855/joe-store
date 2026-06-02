import prisma from '../config/db.js';

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : '';
    const category = await prisma.category.create({
      data: { name, image }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    let image = category.image;
    if (req.file) image = req.file.path;
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, image }
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
