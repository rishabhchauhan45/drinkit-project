import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';

let io: SocketServer;

export const initSocket = (server: Server) => {
  io = new SocketServer(server, {
    cors: { origin: [process.env.FRONTEND_URL || 'http://localhost:3001', 'https://drinkit-project.vercel.app', 'http://localhost:3001'], credentials: true },
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
