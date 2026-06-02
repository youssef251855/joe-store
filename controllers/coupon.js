import prisma from '../config/db.js';

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, expiryDate } = req.body;
    const coupon = await prisma.coupon.create({
      data: { code, discount: parseFloat(discount), expiryDate: new Date(expiryDate) }
    });
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.active || new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }
    res.status(200).json({ valid: true, discount: coupon.discount });
  } catch (error) {
    next(error);
  }
};
