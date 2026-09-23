"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = exports.emitOrderUpdate = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: true, credentials: true },
        transports: ['websocket', 'polling']
    });
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);
        socket.on('join-order', async ({ orderId, token }) => {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
                const user = await database_1.prisma.user.findUnique({ where: { id: decoded.id } });
                if (user?.role === 'ADMIN' || user?.role === 'DELIVERY_PARTNER') {
                    socket.join(`order:${orderId}`);
                    return;
                }
                const order = await database_1.prisma.order.findUnique({ where: { id: orderId } });
                if (order?.userId === user?.id) {
                    socket.join(`order:${orderId}`);
                }
            }
            catch (err) {
                console.error('Socket join auth failed');
            }
        });
        socket.on('partner-location', (data) => {
            io.to(`order:${data.orderId}`).emit('partner-moved', { lat: data.lat, lng: data.lng, eta: data.eta });
        });
        socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
};
exports.getIO = getIO;
const emitOrderUpdate = (orderId, data) => {
    io.to(`order:${orderId}`).emit('order-update', data);
};
exports.emitOrderUpdate = emitOrderUpdate;
const emitNotification = (userId, data) => {
    io.to(`user:${userId}`).emit('notification', data);
};
exports.emitNotification = emitNotification;
