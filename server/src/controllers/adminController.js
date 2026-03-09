import prisma from '../config/db.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, department: true, year: true, role: true, points: true, createdAt: true } });
    res.json(users);
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    await prisma.user.update({ where: { id }, data: { role } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const stats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalMaterials = await prisma.material.count();
    res.json({ totalUsers, totalMaterials });
  } catch (err) { next(err); }
};
