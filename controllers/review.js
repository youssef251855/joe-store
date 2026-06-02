import prisma from '../config/db.js';

export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const review = await prisma.review.create({
      data: { userId, productId, rating: parseInt(rating), comment }
    });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
