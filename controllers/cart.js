import prisma from '../config/db.js';

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + parseInt(quantity) }
      });
      return res.status(200).json(updatedItem);
    }
    const cartItem = await prisma.cartItem.create({
      data: { userId, productId, quantity: parseInt(quantity) }
    });
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity: parseInt(quantity) }
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });
    res.status(200).json(cartItems);
  } catch (error) {
    next(error);
  }
};
