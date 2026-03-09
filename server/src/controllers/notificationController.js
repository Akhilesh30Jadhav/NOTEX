import prisma from '../config/db.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, read: false }
    });
    res.json({ notifications, unreadCount });
  } catch (err) { next(err); }
};

export const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId: req.user.id },
        data: { read: true }
      });
    } else {
      await prisma.notification.update({ where: { id }, data: { read: true } });
    }
    res.json({ success: true });
  } catch (err) { next(err); }
};

export const createNotification = async (userId, type, title, message, link) => {
  try {
    await prisma.notification.create({ data: { userId, type, title, message, link } });
  } catch (err) {
    console.error('Notification creation failed:', err);
  }
};
