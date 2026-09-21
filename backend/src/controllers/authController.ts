import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(21, 'You must be at least 21 years old to register').or(z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 21, 'You must be at least 21 years old to register')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  state: z.string().optional()
});

export const authController = {
  async register(req: any, res: any, next: any) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, phone, name, age, password, state } = validatedData;
      
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] }
      });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: existingUser.email === email ? 'Email already in use' : 'Phone number already in use',
          errors: []
        });
      }

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
      
      res.status(201).json({ success: true, message: 'Registration successful', data: { token, user: { id: user.id, email, name, role: user.role } } });
    } catch (error: any) { 
      next(error); 
    }
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
      res.json({ success: true, data: user });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  }
};
