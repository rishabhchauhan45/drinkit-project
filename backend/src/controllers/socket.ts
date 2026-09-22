import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

let io: SocketServer;

export const initSocket = (server: Server) => {
  io = new SocketServer(server, {
    cors: { origin: true, credentials: true },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('join-order', async ({ orderId, token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (user?.role === 'ADMIN' || user?.role === 'DELIVERY_PARTNER') {
          socket.join(`order:${orderId}`);
          return;
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order?.userId === user?.id) {
          socket.join(`order:${orderId}`);
        }
      } catch (err) {
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

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export const emitOrderUpdate = (orderId: string, data: any) => {
  io.to(`order:${orderId}`).emit('order-update', data);
};

export const emitNotification = (userId: string, data: any) => {
  io.to(`user:${userId}`).emit('notification', data);
};
