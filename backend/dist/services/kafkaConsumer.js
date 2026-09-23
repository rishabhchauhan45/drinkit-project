"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDeliveryLocationConsumer = void 0;
const kafka_1 = require("../config/kafka");
const socket_1 = require("../controllers/socket");
const database_1 = require("../config/database");
const startDeliveryLocationConsumer = async () => {
    try {
        await kafka_1.consumer.subscribe({ topic: 'delivery-location-updates', fromBeginning: false });
        await kafka_1.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (!message.value)
                    return;
                try {
                    const payload = JSON.parse(message.value.toString());
                    const { orderId, lat, lng, partnerId, timestamp } = payload;
                    if (orderId) {
                        // Ensure the order belongs to this partner before emitting
                        const order = await database_1.prisma.order.findUnique({ where: { id: orderId } });
                        if (order?.deliveryPartnerId === partnerId) {
                            // Trigger the existing Socket.io logic
                            (0, socket_1.getIO)().to(`order:${orderId}`).emit('partnerLocationUpdate', { lat, lng, timestamp });
                        }
                    }
                    if (partnerId) {
                        // Batch save coordinates asynchronously
                        await database_1.prisma.deliveryProfile.upsert({
                            where: { userId: partnerId },
                            update: { currentLocationLat: lat, currentLocationLng: lng },
                            create: {
                                userId: partnerId,
                                vehicleType: 'UNKNOWN',
                                vehicleNumber: 'UNKNOWN',
                                currentLocationLat: lat,
                                currentLocationLng: lng,
                                isOnline: true
                            }
                        });
                    }
                }
                catch (err) {
                    console.error('Error processing Kafka message:', err);
                }
            },
        });
        console.log('✅ Kafka Consumer listening to delivery-location-updates');
    }
    catch (error) {
        console.error('❌ Failed to start Kafka consumer for delivery locations:', error);
    }
};
exports.startDeliveryLocationConsumer = startDeliveryLocationConsumer;
