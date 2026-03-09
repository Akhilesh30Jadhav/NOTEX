import prisma from '../config/db.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, department: true, year: true, points: true, badges: true, avatar: true },
      orderBy: { points: 'desc' },
      take: 50
    });
    res.json(users);
  } catch (err) { next(err); }
};

export const awardPoints = async (userId, amount, reason) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const newPoints = user.points + amount;

    const badges = [
      { threshold: 10, name: 'Starter', icon: '🌱' },
      { threshold: 50, name: 'Contributor', icon: '⭐' },
      { threshold: 100, name: 'Scholar', icon: '📚' },
      { threshold: 250, name: 'Expert', icon: '🏆' },
      { threshold: 500, name: 'Legend', icon: '👑' }
    ];

    const currentBadges = Array.isArray(user.badges) ? user.badges : [];
    const newBadges = [...currentBadges];
    for (const badge of badges) {
      if (newPoints >= badge.threshold && !currentBadges.find(b => b.name === badge.name)) {
        newBadges.push({ name: badge.name, icon: badge.icon, earnedAt: new Date().toISOString() });
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { points: newPoints, badges: newBadges }
    });
  } catch (err) {
    console.error('Award points failed:', err);
  }
};
