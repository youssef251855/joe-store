import prisma from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });
    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};
