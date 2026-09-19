"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
const Inventory_1 = require("../models/Inventory");
const socket_1 = require("../config/socket");
exports.orderController = {
    /**
     * Creates a new order. Handles inventory check, age verification for alcohol, and safe stock deduction.
     */
    async createOrder(req, res) {
        let deductedProducts = [];
        try {
            const { products, address, paymentMethod } = req.body;
            const productIds = products.map((p) => p.productId);
            const dbProducts = await Product_1.Product.find({ _id: { $in: productIds } });
            let totalAmount = 0;
            let deliveryFee = 40;
            let tax = 0;
            const productDetails = [];
            let containsAlcohol = false;
            const alcoholCategories = ['WHISKEY', 'VODKA', 'RUM', 'GIN', 'WINE', 'BEER'];
            for (const item of products) {
                const product = dbProducts.find(p => p._id.toString() === item.productId);
                if (!product) {
                    return res.status(400).json({ success: false, error: `Product ${item.productId} not found` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ success: false, error: `Product ${product.name} is out of stock` });
                }
                if (alcoholCategories.includes(product.category)) {
                    containsAlcohol = true;
                }
            }
            if (containsAlcohol) {
                const user = await database_1.prisma.user.findUnique({ where: { id: req.user.id } });
                if (!user?.isVerified) {
                    return res.status(403).json({ success: false, error: 'Age verification required for alcohol products' });
                }
            }
            for (const item of products) {
                const product = dbProducts.find(p => p._id.toString() === item.productId);
                product.stock -= item.quantity;
                await product.save();
                deductedProducts.push({ id: product._id.toString(), quantity: item.quantity });
                const subtotal = product.price * item.quantity;
                totalAmount += subtotal;
                productDetails.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.images[0]
                });
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
            for (const item of products) {
                await Inventory_1.Inventory.findOneAndUpdate({ productId: item.productId }, { $inc: { reserved: item.quantity } }).catch(() => { });
            }
            (0, socket_1.emitOrderUpdate)(order.id, { status: 'PENDING', message: 'Order created' });
            res.status(201).json({ success: true, data: order });
        }
        catch (error) {
            if (deductedProducts.length > 0) {
                for (const item of deductedProducts) {
                    await Product_1.Product.findByIdAndUpdate(item.id, { $inc: { stock: item.quantity } }).catch(() => { });
                }
            }
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
            const orderId = req.params.id;
            const currentOrder = await database_1.prisma.order.findUnique({ where: { id: orderId } });
            if (!currentOrder)
                return res.status(404).json({ success: false, error: 'Order not found' });
            if (req.user.role === 'USER') {
                if (status !== 'CANCELLED' || currentOrder.status !== 'PENDING') {
                    return res.status(403).json({ success: false, error: 'Users can only cancel pending orders' });
                }
            }
            else if (req.user.role !== 'ADMIN' && req.user.role !== 'DELIVERY_PARTNER') {
                return res.status(403).json({ success: false, error: 'Unauthorized' });
            }
            const order = await database_1.prisma.order.update({
                where: { id: orderId },
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
