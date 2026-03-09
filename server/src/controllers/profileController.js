import prisma from '../config/db.js';

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, department: true, year: true, role: true, bio: true, avatar: true, points: true, badges: true, createdAt: true }
    });
    if (!user) { res.status(404); throw new Error('User not found'); }

    const uploadCount = await prisma.material.count();
    const downloadCount = await prisma.download.count({ where: { userId } });
    const reviewCount = await prisma.review.count({ where: { userId } });

    res.json({
      user,
      stats: { uploads: uploadCount, downloads: downloadCount, reviews: reviewCount }
    });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, department, year } = req.body;
    const data = {};
    if (name) data.name = name;
    if (bio !== undefined) data.bio = bio;
    if (department) data.department = department;
    if (year) data.year = parseInt(year);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, name: true, email: true, department: true, year: true, role: true, bio: true, avatar: true, points: true, badges: true, createdAt: true }
    });
    res.json(user);
  } catch (err) { next(err); }
};
