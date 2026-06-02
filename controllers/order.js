import prisma from '../config/db.js';

export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    let totalPrice = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Product ${item.product.name} is out of stock` });
      }
      totalPrice += item.product.price * item.quantity;
    }
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        shippingAddress,
        paymentMethod,
        orderItems: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity }
      });
    }
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role !== 'ADMIN') {
      whereClause.userId = req.user.id;
    }
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
