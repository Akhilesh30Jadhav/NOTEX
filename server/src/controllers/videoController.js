import prisma from '../config/db.js';

export const getVideos = async (req, res, next) => {
  try {
    const { subject, department, year } = req.query;
    const where = {};
    if (subject) where.subject = subject;
    if (department) where.department = department;
    if (year) where.year = parseInt(year);
    const videos = await prisma.videoLecture.findMany({
      where,
      include: { uploadedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(videos);
  } catch (err) { next(err); }
};

export const addVideo = async (req, res, next) => {
  try {
    const video = await prisma.videoLecture.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        subject: req.body.subject,
        department: req.body.department,
        year: req.body.year ? parseInt(req.body.year) : null,
        videoUrl: req.body.videoUrl,
        thumbnailUrl: req.body.thumbnailUrl,
        duration: req.body.duration,
        uploadedById: req.user.id
      }
    });
    res.status(201).json(video);
  } catch (err) { next(err); }
};

export const incrementView = async (req, res, next) => {
  try {
    await prisma.videoLecture.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } }
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};
