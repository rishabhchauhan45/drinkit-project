"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const Inventory_1 = require("../models/Inventory");
const socket_1 = require("../config/socket");
exports.orderController = {
    async createOrder(req, res) {
        try {
            const { products, address, paymentMethod } = req.body;
            let totalAmount = 0;
            let deliveryFee = 40;
            let tax = 0;
            const productDetails = [];
            for (const item of products) {
                const product = await Product_1.Product.findById(item.productId);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({ success: false, error: `Product ${item.productId} out of stock` });
                }
                product.stock -= item.quantity;
                await product.save();
                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;
                productDetails.push({ productId: product._id, name: product.name, price: product.price, quantity: item.quantity, image: product.images[0] });
                await Inventory_1.Inventory.findOneAndUpdate({ productId: product._id }, { $inc: { reserved: item.quantity } });
            }
            if (totalAmount > 500)
                deliveryFee = 0;
            tax = totalAmount * 0.18;
            const order = await database_1.prisma.order.create({
                data: {
                    userId: req.user.id,
                    products: productDetails,
                    totalAmount: totalAmount + deliveryFee + tax,
                    deliveryFee,
                    tax,
                    status: 'PENDING',
                    paymentStatus: 'PENDING'
                }
            });
            (0, socket_1.emitOrderUpdate)(order.id, { status: 'PENDING', message: 'Order created' });
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async getOrderById(req, res) {
        try {
            const order = await database_1.prisma.order.findUnique({
                where: { id: req.params.id },
                include: { delivery: true, user: { select: { name: true, email: true, phone: true } } }
            });
            if (!order)
                return res.status(404).json({ success: false, error: 'Order not found' });
            if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
            }
            res.json({ success: true, data: order });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async getUserOrders(req, res) {
        try {
            const orders = await database_1.prisma.order.findMany({
                where: { userId: req.params.userId },
                orderBy: { createdAt: 'desc' }
            });
            res.json({ success: true, data: orders });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await database_1.prisma.order.update({
                where: { id: req.params.id },
                data: { status }
            });
            (0, socket_1.emitOrderUpdate)(order.id, { status, message: `Order ${status}` });
            res.json({ success: true, data: order });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
