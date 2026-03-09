import prisma from '../config/db.js';

export const markAttendance = async (req, res, next) => {
  try {
    const { subject, date, status } = req.body;
    const dateObj = new Date(date);
    const statusLower = status.toLowerCase();
    const record = await prisma.attendance.upsert({
      where: { userId_subject_date: { userId: req.user.id, subject, date: dateObj } },
      update: { status: statusLower },
      create: { userId: req.user.id, subject, date: dateObj, status: statusLower }
    });
    res.json(record);
  } catch (err) { next(err); }
};

export const getAttendance = async (req, res, next) => {
  try {
    const { subject } = req.query;
    const where = { userId: req.user.id };
    if (subject) where.subject = subject;
    const records = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    const subjects = {};
    records.forEach(r => {
      if (!subjects[r.subject]) subjects[r.subject] = { present: 0, total: 0 };
      subjects[r.subject].total++;
      if (r.status === 'present') subjects[r.subject].present++;
    });

    const summary = Object.entries(subjects).map(([name, data]) => ({
      subject: name,
      present: data.present,
      total: data.total,
      percentage: ((data.present / data.total) * 100).toFixed(1)
    }));

    res.json({ records, summary });
  } catch (err) { next(err); }
};
