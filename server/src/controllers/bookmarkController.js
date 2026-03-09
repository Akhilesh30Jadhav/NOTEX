import prisma from '../config/db.js';

export const toggleBookmark = async (req, res, next) => {
  try {
    const { materialId } = req.params;
    const existing = await prisma.bookmark.findUnique({
      where: { userId_materialId: { userId: req.user.id, materialId } }
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
    } else {
      await prisma.bookmark.create({ data: { userId: req.user.id, materialId } });
    }
    const bookmarks = await prisma.bookmark.findMany({ where: { userId: req.user.id }, select: { materialId: true } });
    res.json({ bookmarks: bookmarks.map(b => b.materialId) });
  } catch (err) { next(err); }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: { material: true }
    });
    res.json(bookmarks.map(b => b.material));
  } catch (err) { next(err); }
};
