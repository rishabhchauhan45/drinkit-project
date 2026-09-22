import { prisma } from '../config/database';
import { emitOrderUpdate, getIO } from './socket';

export const deliveryController = {
  // Fetch orders assigned to the logged-in delivery partner
  async getAssignedOrders(req: any, res: any) {
    try {
      const orders = await prisma.order.findMany({
        where: { deliveryPartnerId: req.user.id },
        include: {
          user: { select: { name: true, phone: true } },
        },
        orderBy: { updatedAt: 'desc' }
      });
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update order status (only if assigned to this partner)
  async updateOrderStatus(req: any, res: any) {
    try {
      const { status } = req.body;
      const orderId = req.params.id;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      if (order.deliveryPartnerId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized: Order not assigned to you' });
      }

      const validStatuses = ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status update for delivery partner' });
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });

      emitOrderUpdate(order.id, { status, message: `Order is now ${status}` });
      res.json({ success: true, data: updatedOrder });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update partner location and emit to order room
  async updateLocation(req: any, res: any) {
    try {
      const { lat, lng, orderId } = req.body;
      const partnerId = req.user.id;

      // Ensure the order belongs to this partner
      if (orderId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order?.deliveryPartnerId === partnerId) {
          getIO().to(`order:${orderId}`).emit('partnerLocationUpdate', { lat, lng, timestamp: new Date() });
        }
      }

      // Update the profile with latest coordinates
      await prisma.deliveryProfile.upsert({
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

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Set partner online/offline
  async toggleOnlineStatus(req: any, res: any) {
    try {
      const { isOnline } = req.body;
      const partnerId = req.user.id;

      const profile = await prisma.deliveryProfile.upsert({
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
