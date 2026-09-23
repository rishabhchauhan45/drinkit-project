"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponController = void 0;
const database_1 = require("../config/database");
exports.couponController = {
    // --- ADMIN ROUTES ---
    async createCoupon(req, res) {
        try {
            const { code, discountType, discountValue, minOrderValue, maxDiscount, expiryDate, isActive, usageLimit } = req.body;
            if (!code || !discountType || discountValue === undefined || !expiryDate || usageLimit === undefined) {
                return res.status(400).json({ success: false, error: 'Missing required fields' });
            }
            const existing = await database_1.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
            if (existing) {
                return res.status(400).json({ success: false, error: 'Coupon code already exists' });
            }
            const coupon = await database_1.prisma.coupon.create({
                data: {
                    code: code.toUpperCase(),
                    discountType,
                    discountValue,
                    minOrderValue: minOrderValue || null,
                    maxDiscount: maxDiscount || null,
                    expiryDate: new Date(expiryDate),
                    isActive: isActive !== undefined ? isActive : true,
                    usageLimit,
                }
            });
            res.status(201).json({ success: true, data: coupon });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async getCoupons(req, res) {
        try {
            const coupons = await database_1.prisma.coupon.findMany({
                orderBy: { createdAt: 'desc' }
            });
            res.json({ success: true, data: coupons });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async updateCoupon(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (data.code)
                data.code = data.code.toUpperCase();
            if (data.expiryDate)
                data.expiryDate = new Date(data.expiryDate);
            const coupon = await database_1.prisma.coupon.update({
                where: { id },
                data
            });
            res.json({ success: true, data: coupon });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async deactivateCoupon(req, res) {
        try {
            const { id } = req.params;
            const coupon = await database_1.prisma.coupon.update({
                where: { id },
                data: { isActive: false }
            });
            res.json({ success: true, data: coupon });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    // --- PUBLIC ROUTES ---
    async applyCoupon(req, res) {
        try {
            const { code, cartTotal } = req.body;
            if (!code || cartTotal === undefined) {
                return res.status(400).json({ success: false, error: 'Code and cart total are required' });
            }
            const coupon = await database_1.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
            if (!coupon) {
                return res.status(404).json({ success: false, error: 'Invalid coupon code' });
            }
            if (!coupon.isActive) {
                return res.status(400).json({ success: false, error: 'Coupon is no longer active' });
            }
            if (new Date() > coupon.expiryDate) {
                return res.status(400).json({ success: false, error: 'Coupon has expired' });
            }
            if (coupon.usedCount >= coupon.usageLimit) {
                return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
            }
            if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
                return res.status(400).json({ success: false, error: `Minimum order value of ₹${coupon.minOrderValue} required` });
            }
            let discountAmount = 0;
            if (coupon.discountType === 'PERCENTAGE') {
                discountAmount = (cartTotal * coupon.discountValue) / 100;
                if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                    discountAmount = coupon.maxDiscount;
                }
            }
            else {
                discountAmount = coupon.discountValue;
            }
            // Ensure discount isn't more than cart total
            if (discountAmount > cartTotal) {
                discountAmount = cartTotal;
            }
            const finalTotal = cartTotal - discountAmount;
            res.json({
                success: true,
                data: {
                    discountAmount,
                    finalTotal,
                    couponCode: coupon.code,
                    message: `Coupon Applied! You saved ₹${discountAmount.toFixed(2)}`
                }
            });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
