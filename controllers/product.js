import prisma from '../config/db.js';

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, oldPrice, stock, featured, categoryId } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        stock: parseInt(stock),
        featured: featured === 'true',
        categoryId,
        images
      }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, oldPrice, stock, featured, categoryId } = req.body;
    const productExists = await prisma.product.findUnique({ where: { id } });
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let images = productExists.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        featured: featured !== undefined ? featured === 'true' : undefined,
        categoryId,
        images
      }
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, reviews: true }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, categoryId, minPrice, maxPrice, sort } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }
    let orderBy = { createdAt: 'desc' };
    if (sort) {
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      if (sort === 'price_desc') orderBy = { price: 'desc' };
    }
    const products = await prisma.product.findMany({
      where: whereClause,
      skip: skip,
      take: parseInt(limit),
      orderBy: orderBy,
      include: { category: true }
    });
    const total = await prisma.product.count({ where: whereClause });
    res.status(200).json({
      products,
      meta: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
