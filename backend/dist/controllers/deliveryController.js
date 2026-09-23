"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliveryController = void 0;
const database_1 = require("../config/database");
const socket_1 = require("./socket");
const kafka_1 = require("../config/kafka");
exports.deliveryController = {
    // Fetch orders assigned to the logged-in delivery partner
    async getAssignedOrders(req, res) {
        try {
            const orders = await database_1.prisma.order.findMany({
                where: { deliveryPartnerId: req.user.id },
                include: {
                    user: { select: { name: true, phone: true } },
                },
                orderBy: { updatedAt: 'desc' }
            });
            res.json({ success: true, data: orders });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    // Update order status (only if assigned to this partner)
    async updateOrderStatus(req, res) {
        try {
            const { status } = req.body;
            const orderId = req.params.id;
            const order = await database_1.prisma.order.findUnique({ where: { id: orderId } });
            if (!order)
                return res.status(404).json({ success: false, error: 'Order not found' });
            if (order.deliveryPartnerId !== req.user.id) {
                return res.status(403).json({ success: false, error: 'Unauthorized: Order not assigned to you' });
            }
            const validStatuses = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, error: 'Invalid status update for delivery partner' });
            }
            const updatedOrder = await database_1.prisma.order.update({
                where: { id: orderId },
                data: { status }
            });
            (0, socket_1.emitOrderUpdate)(order.id, { status, message: `Order is now ${status}` });
            res.json({ success: true, data: updatedOrder });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    // Update partner location via Kafka
    async updateLocation(req, res) {
        try {
            const { lat, lng, orderId } = req.body;
            const partnerId = req.user.id;
            const payload = {
                orderId,
                lat,
                lng,
                partnerId,
                timestamp: new Date()
            };
            // Publish to Kafka topic instead of doing it synchronously
            try {
                await kafka_1.producer.send({
                    topic: 'delivery-location-updates',
                    messages: [
                        { value: JSON.stringify(payload) }
                    ]
                });
            }
            catch (kafkaError) {
                console.error('Failed to publish location to Kafka:', kafkaError);
                // Fallback or just log depending on strictness
            }
            // Return 202 Accepted immediately for blazing-fast performance
            res.status(202).json({ success: true, message: 'Location update accepted' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
    // Set partner online/offline
    async toggleOnlineStatus(req, res) {
        try {
            const { isOnline } = req.body;
            const partnerId = req.user.id;
            const profile = await database_1.prisma.deliveryProfile.upsert({
                where: { userId: partnerId },
                update: { isOnline },
                create: {
                    userId: partnerId,
                    vehicleType: 'UNKNOWN',
                    vehicleNumber: 'UNKNOWN',
                    isOnline
                }
            });
            res.json({ success: true, data: profile });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};
