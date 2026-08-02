"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const database_1 = require("../config/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authController = {
    async register(req, res) {
        try {
            const { email, phone, name, age, password, state } = req.body;
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
            res.status(201).json({ success: true, data: { token, user: { id: user.id, email, name, role: user.role } } });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
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
            res.json({ success: true, user });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
