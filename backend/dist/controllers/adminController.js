"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const database_2 = require("../config/database");
const zod_1 = require("zod");
const stockUpdateSchema = zod_1.z.object({
    stock: zod_1.z.number().min(0, 'Stock cannot be negative').or(zod_1.z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 0, 'Stock cannot be negative'))
});
exports.adminController = {
    /**
     * Get Dashboard Statistics
     */
    async getDashboardStats(req, res) {
        try {
            // 1. Fetch Product Metrics from MongoDB
            const totalProducts = await Product_1.Product.countDocuments();
            const activeProducts = await Product_1.Product.countDocuments({ isActive: true });
            const lowStockProducts = await Product_1.Product.countDocuments({ stock: { $lte: 20, $gt: 0 } });
            const outOfStockProducts = await Product_1.Product.countDocuments({ stock: 0 });
            // 2. Fetch Order Metrics from PostgreSQL
            const totalOrders = await database_1.prisma.order.count();
            const pendingOrders = await database_1.prisma.order.count({ where: { status: 'PENDING' } });
            const confirmedOrders = await database_1.prisma.order.count({ where: { status: 'CONFIRMED' } });
            const deliveredOrders = await database_1.prisma.order.count({ where: { status: 'DELIVERED' } });
            // 3. Calculate total revenue from PAID orders
            const revenueData = await database_1.prisma.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { totalAmount: true }
            });
            const totalRevenue = revenueData._sum.totalAmount || 0;
            // 4. Calculate total active users
            const activeUsers = await database_1.prisma.user.count({ where: { role: 'USER' } });
            // 5. Fetch recent orders
            const recentOrders = await database_1.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } }
            });
            res.json({
                success: true,
                data: {
                    metrics: {
                        totalProducts,
                        activeProducts,
                        lowStockProducts,
                        outOfStockProducts,
                        totalOrders,
                        pendingOrders,
                        confirmedOrders,
                        deliveredOrders,
                        totalRevenue,
                        activeUsers
                    },
                    recentOrders: recentOrders.map((o) => ({
                        id: o.id,
                        customer: o.user.name,
                        amount: o.totalAmount,
                        status: o.status,
                        time: o.createdAt
                    }))
                }
            });
        }
        catch (error) {
            console.error('getDashboardStats Error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },
    /**
     * Get all orders with pagination and filtering
     */
    async getAllOrders(req, res) {
        try {
            const { page = 1, limit = 10, status, paymentStatus } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const whereClause = {};
            if (status)
                whereClause.status = status;
            if (paymentStatus)
                whereClause.paymentStatus = paymentStatus;
            const [orders, total] = await Promise.all([
                database_1.prisma.order.findMany({
                    where: whereClause,
                    skip,
                    take: Number(limit),
                    orderBy: { createdAt: 'desc' },
                    include: { user: { select: { name: true, email: true, phone: true } } }
                }),
                database_1.prisma.order.count({ where: whereClause })
            ]);
            res.json({ success: true, data: orders, total, page: Number(page), limit: Number(limit) });
        }
        catch (error) {
            console.error('getAllOrders Error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },
    /**
     * Get inventory list
     */
    async getInventory(req, res) {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const filter = {};
            if (search)
                filter.$text = { $search: search };
            const products = await Product_1.Product.find(filter)
                .select('_id name category stock price')
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));
            const total = await Product_1.Product.countDocuments(filter);
            const inventoryData = products.map((p) => {
                let stockStatus = 'IN_STOCK';
                if (p.stock === 0)
                    stockStatus = 'OUT_OF_STOCK';
                else if (p.stock <= 20)
                    stockStatus = 'LOW_STOCK';
                return {
                    _id: p._id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    stock: p.stock,
                    stockStatus
                };
            });
            res.json({ success: true, data: inventoryData, total, page: Number(page), limit: Number(limit) });
        }
        catch (error) {
            console.error('getInventory Error:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },
    /**
     * Safely update inventory stock
     */
    async updateInventory(req, res) {
        try {
            const { productId } = req.params;
            const validatedData = stockUpdateSchema.parse(req.body);
            const newStock = validatedData.stock;
            const product = await Product_1.Product.findById(productId);
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }
            const previousStock = product.stock;
            product.stock = newStock;
            await product.save();
            // Log in Prisma AuditLog
            await database_1.prisma.auditLog.create({
                data: {
                    userId: req.user.id,
                    action: 'MANUAL_ADJUSTMENT',
                    details: {
                        productId: product._id.toString(),
                        productName: product.name,
                        previousStock,
                        newStock,
                        difference: newStock - previousStock
                    }
                }
            });
            // Clear product cache
            try {
                const keys = await database_2.redis.keys('products:*');
                if (keys.length > 0)
                    await database_2.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            let stockStatus = 'IN_STOCK';
            if (product.stock === 0)
                stockStatus = 'OUT_OF_STOCK';
            else if (product.stock <= 20)
                stockStatus = 'LOW_STOCK';
            res.json({
                success: true,
                message: 'Stock updated successfully',
                data: {
                    _id: product._id,
                    name: product.name,
                    category: product.category,
                    stock: product.stock,
                    stockStatus
                }
            });
        }
        catch (error) {
            console.error('updateInventory Error:', error);
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async getDeliveryPartners(req, res) {
        try {
            const partners = await database_1.prisma.user.findMany({
                where: { role: 'DELIVERY_PARTNER' },
                include: { deliveryProfile: true }
            });
            res.json({ success: true, data: partners });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    async assignDeliveryPartner(req, res) {
        try {
            const { partnerId } = req.body;
            const orderId = req.params.id;
            const order = await database_1.prisma.order.update({
                where: { id: orderId },
                data: { deliveryPartnerId: partnerId, status: 'OUT_FOR_DELIVERY' }
            });
            res.json({ success: true, data: order });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
