import prisma from '../config/db.js';

export const getDocs = async (req, res, next) => {
  try {
    const docs = await prisma.noteDoc.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { collaborators: { some: { id: req.user.id } } },
          { isPublic: true }
        ]
      },
      include: { owner: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(docs);
  } catch (err) { next(err); }
};

export const createDoc = async (req, res, next) => {
  try {
    const doc = await prisma.noteDoc.create({
      data: {
        title: req.body.title,
        content: req.body.content || '',
        subject: req.body.subject,
        isPublic: req.body.isPublic || false,
        ownerId: req.user.id
      }
    });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

export const getDoc = async (req, res, next) => {
  try {
    const doc = await prisma.noteDoc.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { name: true } },
        collaborators: { select: { id: true, name: true, email: true } }
      }
    });
    if (!doc) { res.status(404); throw new Error('Doc not found'); }
    res.json(doc);
  } catch (err) { next(err); }
};

export const updateDoc = async (req, res, next) => {
  try {
    const doc = await prisma.noteDoc.findUnique({
      where: { id: req.params.id },
      include: { collaborators: { select: { id: true } } }
    });
    if (!doc) { res.status(404); throw new Error('Doc not found'); }
    const isAllowed = doc.ownerId === req.user.id || doc.collaborators.some(c => c.id === req.user.id);
    if (!isAllowed) { res.status(403); throw new Error('Not authorized'); }
    const updated = await prisma.noteDoc.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        content: req.body.content,
        subject: req.body.subject,
        isPublic: req.body.isPublic
      }
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const addCollaborator = async (req, res, next) => {
  try {
    const doc = await prisma.noteDoc.findUnique({ where: { id: req.params.id } });
    if (!doc || doc.ownerId !== req.user.id) {
      res.status(403); throw new Error('Not authorized');
    }
    const updated = await prisma.noteDoc.update({
      where: { id: req.params.id },
      data: { collaborators: { connect: { id: req.body.userId } } },
      include: { collaborators: { select: { id: true, name: true, email: true } } }
    });
    res.json(updated);
  } catch (err) { next(err); }
};
