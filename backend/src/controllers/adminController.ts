import { prisma } from '../config/database';
import { Product } from '../models/Product';
import { redis } from '../config/database';
import { z } from 'zod';

const stockUpdateSchema = z.object({
  stock: z.number().min(0, 'Stock cannot be negative').or(z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 0, 'Stock cannot be negative'))
});

export const adminController = {
  /**
   * Get Dashboard Statistics
   */
  async getDashboardStats(req: any, res: any) {
    try {
      // 1. Fetch Product Metrics from MongoDB
      const totalProducts = await Product.countDocuments();
      const activeProducts = await Product.countDocuments({ isActive: true });
      const lowStockProducts = await Product.countDocuments({ stock: { $lte: 20, $gt: 0 } });
      const outOfStockProducts = await Product.countDocuments({ stock: 0 });

      // 2. Fetch Order Metrics from PostgreSQL
      const totalOrders = await prisma.order.count();
      const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
      const confirmedOrders = await prisma.order.count({ where: { status: 'CONFIRMED' } });
      const deliveredOrders = await prisma.order.count({ where: { status: 'DELIVERED' } });

      // 3. Calculate total revenue from PAID orders
      const revenueData = await prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true }
      });
      const totalRevenue = revenueData._sum.totalAmount || 0;

      // 4. Calculate total active users
      const activeUsers = await prisma.user.count({ where: { role: 'USER' } });

      // 5. Fetch recent orders
      const recentOrders = await prisma.order.findMany({
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
          recentOrders: recentOrders.map((o: any) => ({
            id: o.id,
            customer: o.user.name,
            amount: o.totalAmount,
            status: o.status,
            time: o.createdAt
          }))
        }
      });
    } catch (error: any) {
      console.error('getDashboardStats Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Get all orders with pagination and filtering
   */
  async getAllOrders(req: any, res: any) {
    try {
      const { page = 1, limit = 10, status, paymentStatus } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const whereClause: any = {};
      if (status) whereClause.status = status;
      if (paymentStatus) whereClause.paymentStatus = paymentStatus;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, email: true, phone: true } } }
        }),
        prisma.order.count({ where: whereClause })
      ]);

      res.json({ success: true, data: orders, total, page: Number(page), limit: Number(limit) });
    } catch (error: any) {
      console.error('getAllOrders Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Get inventory list
   */
  async getInventory(req: any, res: any) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const filter: any = {};
      if (search) filter.$text = { $search: search };

      const products = await Product.find(filter)
        .select('_id name category stock price')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await Product.countDocuments(filter);

      const inventoryData = products.map((p) => {
        let stockStatus = 'IN_STOCK';
        if (p.stock === 0) stockStatus = 'OUT_OF_STOCK';
        else if (p.stock <= 20) stockStatus = 'LOW_STOCK';

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
    } catch (error: any) {
      console.error('getInventory Error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  /**
   * Safely update inventory stock
   */
  async updateInventory(req: any, res: any) {
    try {
      const { productId } = req.params;
      const validatedData = stockUpdateSchema.parse(req.body);
      const newStock = validatedData.stock;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      const previousStock = product.stock;
      product.stock = newStock;
      await product.save();

      // Log in Prisma AuditLog
      await prisma.auditLog.create({
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
        const keys = await redis.keys('products:*');
        if (keys.length > 0) await redis.del(...keys);
      } catch (redisErr) {
        console.warn('Redis cache clear error:', redisErr);
      }

      let stockStatus = 'IN_STOCK';
      if (product.stock === 0) stockStatus = 'OUT_OF_STOCK';
      else if (product.stock <= 20) stockStatus = 'LOW_STOCK';

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
    } catch (error: any) {
      console.error('updateInventory Error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async getDeliveryPartners(req: any, res: any) {
    try {
      const partners = await prisma.user.findMany({
        where: { role: 'DELIVERY_PARTNER' },
        include: { deliveryProfile: true }
      });
      res.json({ success: true, data: partners });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async assignDeliveryPartner(req: any, res: any) {
    try {
      const { partnerId } = req.body;
      const orderId = req.params.id;

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { deliveryPartnerId: partnerId, status: 'OUT_FOR_DELIVERY' }
      });

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
