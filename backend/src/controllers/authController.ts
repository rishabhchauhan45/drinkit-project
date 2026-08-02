import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authController = {
  async register(req: any, res: any) {
    try {
      const { email, phone, name, age, password, state } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, phone, name, age, password: hashedPassword, isVerified: age >= 21 }
      });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(201).json({ success: true, data: { token, user: { id: user.id, email, name, role: user.role } } });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async login(req: any, res: any) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ success: false, error: 'Invalid credentials' });
      
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async refresh(req: any, res: any) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) return res.status(401).json({ success: false, error: 'No refresh token provided' });
      
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET!);
      const token = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET!, { expiresIn: '15m' });
      
      res.json({ success: true, data: { token } });
    } catch (error: any) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
  },
  async logout(req: any, res: any) {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  },
  async getProfile(req: any, res: any) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { addresses: true } });
      res.json({ success: true, user });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  }
};
