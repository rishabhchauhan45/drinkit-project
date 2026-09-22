"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    phone: zod_1.z.string().min(10, 'Phone number must be at least 10 characters'),
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    age: zod_1.z.number().min(21, 'You must be at least 21 years old to register').or(zod_1.z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 21, 'You must be at least 21 years old to register')),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    state: zod_1.z.string().optional()
});
exports.authController = {
    async register(req, res, next) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const { email, phone, name, age, password, state } = validatedData;
            const existingUser = await database_1.prisma.user.findFirst({
                where: { OR: [{ email }, { phone }] }
            });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: existingUser.email === email ? 'Email already in use' : 'Phone number already in use',
                    errors: []
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await database_1.prisma.user.create({
                data: { email, phone, name, age, password: hashedPassword, isVerified: age >= 21 }
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(201).json({ success: true, message: 'Registration successful', data: { token, user: { id: user.id, email, name, role: user.role } } });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await database_1.prisma.user.findUnique({ where: { email } });
            if (!user)
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            const isValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isValid)
                return res.status(401).json({ success: false, error: 'Invalid credentials' });
            const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async refresh(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken)
                return res.status(401).json({ success: false, error: 'No refresh token provided' });
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
            const token = jsonwebtoken_1.default.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            res.json({ success: true, data: { token } });
        }
        catch (error) {
            res.status(401).json({ success: false, error: 'Invalid refresh token' });
        }
    },
    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.json({ success: true, message: 'Logged out successfully' });
    },
    async getProfile(req, res) {
        try {
            const user = await database_1.prisma.user.findUnique({ where: { id: req.user.id }, include: { addresses: true } });
            res.json({ success: true, data: user });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
