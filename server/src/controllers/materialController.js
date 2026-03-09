import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const uploadMaterial = async (req, res, next) => {
  try {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
      if (err) return next(err);
      const material = await prisma.material.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          subject: req.body.subject,
          department: req.body.department,
          year: req.body.year ? parseInt(req.body.year) : null,
          category: req.body.category,
          file_url: result.secure_url,
          tags: req.body.tags ? (Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',')) : []
        }
      });
      res.status(201).json(material);
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) { next(err); }
};

export const getMaterials = async (req, res, next) => {
  try {
    const materials = await prisma.material.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(materials);
  } catch (err) { next(err); }
};

export const searchMaterials = async (req, res, next) => {
  try {
    const { q, subject, department, year, category } = req.body;
    const where = {};
    if (q) where.title = { contains: q, mode: 'insensitive' };
    if (subject) where.subject = subject;
    if (department) where.department = department;
    if (year) where.year = parseInt(year);
    if (category) where.category = category;
    const results = await prisma.material.findMany({ where });
    res.json(results);
  } catch (err) { next(err); }
};

export const downloadMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.material.update({ where: { id }, data: { downloads: { increment: 1 } } });
    await prisma.download.create({ data: { userId: req.user.id, materialId: id } });
    const material = await prisma.material.findUnique({ where: { id } });
    res.redirect(material.file_url);
  } catch (err) { next(err); }
};
