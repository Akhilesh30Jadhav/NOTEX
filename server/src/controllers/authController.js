import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, department, year } = req.body;
    if (!name || !email || !password) throw new Error('Missing fields');
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) { res.status(400); throw new Error('User exists'); }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, department, year: year ? parseInt(year) : null }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ token: genToken(user.id), user: userWithoutPassword });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401); throw new Error('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token: genToken(user.id), user: userWithoutPassword });
  } catch (err) { next(err); }
};
