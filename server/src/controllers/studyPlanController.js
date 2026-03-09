import prisma from '../config/db.js';

export const getPlans = async (req, res, next) => {
  try {
    const plans = await prisma.studyPlan.findMany({
      where: { userId: req.user.id },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }]
    });
    res.json(plans);
  } catch (err) { next(err); }
};

export const createPlan = async (req, res, next) => {
  try {
    const plan = await prisma.studyPlan.create({
      data: { ...req.body, userId: req.user.id }
    });
    res.status(201).json(plan);
  } catch (err) { next(err); }
};

export const updatePlan = async (req, res, next) => {
  try {
    const plan = await prisma.studyPlan.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!plan) { res.status(404); throw new Error('Plan not found'); }
    const updated = await prisma.studyPlan.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (err) { next(err); }
};

export const deletePlan = async (req, res, next) => {
  try {
    await prisma.studyPlan.deleteMany({
      where: { id: req.params.id, userId: req.user.id }
    });
    res.json({ success: true });
  } catch (err) { next(err); }
};
