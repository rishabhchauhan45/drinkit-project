"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNotification = exports.emitOrderUpdate = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3001', credentials: true },
        transports: ['websocket', 'polling']
    });
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);
        socket.on('join-order', (orderId) => {
            socket.join(`order:${orderId}`);
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
