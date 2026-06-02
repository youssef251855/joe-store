import prisma from '../config/db.js';

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    const wishlist = await prisma.wishlist.create({
      data: { userId, productId }
    });
    res.status(201).json(wishlist);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.wishlist.delete({ where: { id } });
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};
