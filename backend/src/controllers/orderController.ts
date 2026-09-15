import { prisma } from '../config/database';
import { Product } from '../models/Product';
import { Inventory } from '../models/Inventory';
import { emitOrderUpdate } from '../config/socket';

export const orderController = {
  async createOrder(req: any, res: any) {
    let deductedProducts: { id: string, quantity: number }[] = [];
    try {
      const { products, address, paymentMethod } = req.body;
      
      const productIds = products.map((p: any) => p.productId);
      const dbProducts = await Product.find({ _id: { $in: productIds } });
      
      let totalAmount = 0; let deliveryFee = 40; let tax = 0;
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
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user?.isVerified) {
          return res.status(403).json({ success: false, error: 'Age verification required for alcohol products' });
        }
      }

      for (const item of products) {
        const product = dbProducts.find(p => p._id.toString() === item.productId)!;
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

      if (totalAmount > 500) deliveryFee = 0;
      tax = totalAmount * 0.18;

      const order = await prisma.order.create({
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
        await Inventory.findOneAndUpdate({ productId: item.productId }, { $inc: { reserved: item.quantity } }).catch(() => {});
      }

      emitOrderUpdate(order.id, { status: 'PENDING', message: 'Order created' });
      res.status(201).json({ success: true, data: order });

    } catch (error: any) {
      if (deductedProducts.length > 0) {
        for (const item of deductedProducts) {
          await Product.findByIdAndUpdate(item.id, { $inc: { stock: item.quantity } }).catch(() => {});
        }
      }
      res.status(400).json({ success: false, error: error.message }); 
    }
  },
  async getOrderById(req: any, res: any) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { delivery: true, user: { select: { name: true, email: true, phone: true } } }
      });
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
      if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }
      res.json({ success: true, data: order });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async getUserOrders(req: any, res: any) {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.params.userId },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: orders });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async updateOrderStatus(req: any, res: any) {
    try {
      const { status } = req.body;
      const orderId = req.params.id;
      
      const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (!currentOrder) return res.status(404).json({ success: false, error: 'Order not found' });
      
      if (req.user.role === 'USER') {
        if (status !== 'CANCELLED' || currentOrder.status !== 'PENDING') {
          return res.status(403).json({ success: false, error: 'Users can only cancel pending orders' });
        }
      } else if (req.user.role !== 'ADMIN' && req.user.role !== 'DELIVERY_PARTNER') {
         return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });
      emitOrderUpdate(order.id, { status, message: `Order ${status}` });
      res.json({ success: true, data: order });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  }
};
