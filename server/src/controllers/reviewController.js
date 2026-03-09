import prisma from '../config/db.js';

export const addReview = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const { rating, comment } = req.body;
    const existing = await prisma.review.findUnique({
      where: { userId_materialId: { userId: req.user.id, materialId } }
    });
    if (existing) {
      const updated = await prisma.review.update({
        where: { id: existing.id },
        data: { rating: parseInt(rating), comment }
      });
      return res.json(updated);
    }
    const review = await prisma.review.create({
      data: { userId: req.user.id, materialId, rating: parseInt(rating), comment }
    });
    res.status(201).json(review);
  } catch (err) { next(err); }
};

export const getReviews = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { materialId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const avg = reviews.length
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 0;
    res.json({ reviews, average: parseFloat(avg), total: reviews.length });
  } catch (err) { next(err); }
};
