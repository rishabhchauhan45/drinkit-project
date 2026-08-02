import { openaiService } from '../services/openaiService';
import { prisma } from '../config/database';
import { Product } from '../models/Product';

export const aiController = {
  async verifyAge(req: any, res: any) {
    try {
      const { idImage, selfie } = req.body;
      const result = await openaiService.verifyAge(idImage, selfie);
      if (result.isVerified) {
        await prisma.user.update({ where: { id: req.user.id }, data: { isVerified: true } });
      }
      res.json({ success: true, data: result });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async getRecommendations(req: any, res: any) {
    try {
      const orders = await prisma.order.findMany({ where: { userId: req.params.userId } });
      const products = orders.flatMap((o: any) => o.products);
      const result = await openaiService.getRecommendations(products, {});
      res.json({ success: true, data: result });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async getPairings(req: any, res: any) {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      const result = await openaiService.suggestPairings(product.name, product.category);
      res.json({ success: true, data: result });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  }
};
