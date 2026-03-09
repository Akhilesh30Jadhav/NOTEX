import prisma from '../config/db.js';

export const getMessages = async (req, res, next) => {
  try {
    const { room } = req.params;
    const messages = await prisma.chatMessage.findMany({
      where: { room },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(messages.reverse());
  } catch (err) { next(err); }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { room } = req.params;
    const msg = await prisma.chatMessage.create({
      data: { room, senderId: req.user.id, message: req.body.message },
      include: { sender: { select: { id: true, name: true, avatar: true } } }
    });
    res.status(201).json(msg);
  } catch (err) { next(err); }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await prisma.chatMessage.findMany({
      distinct: ['room'],
      select: { room: true }
    });
    res.json(rooms.map(r => r.room));
  } catch (err) { next(err); }
};
