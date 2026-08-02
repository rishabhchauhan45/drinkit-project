import { Product } from '../models/Product';
import { redis } from '../config/database';

export const productController = {
  async getAllProducts(req: any, res: any) {
    try {
      const { category, search, minPrice, maxPrice, brand, page = 1, limit = 10 } = req.query;
      const cacheKey = `products:${JSON.stringify(req.query)}`;
      const cached = await redis.get(cacheKey);
      if (cached) return res.json({ success: true, data: JSON.parse(cached), cached: true });
      const filter: any = { isActive: true };
      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = Number(minPrice); if (maxPrice) filter.price.$lte = Number(maxPrice); }
      if (search) filter.$text = { $search: search };
      const products = await Product.find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).populate('pairings');
      await redis.set(cacheKey, JSON.stringify(products), 'EX', 300);
      res.json({ success: true, data: products, page: Number(page), limit: Number(limit), total: await Product.countDocuments(filter) });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async getProductById(req: any, res: any) {
    try {
      const product = await Product.findById(req.params.id).populate('pairings');
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
      res.json({ success: true, data: product });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async createProduct(req: any, res: any) {
    try {
      const product = await Product.create(req.body);
      const keys = await redis.keys('products:*');
      if (keys.length > 0) await redis.del(...keys);
      res.status(201).json({ success: true, data: product });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async updateProduct(req: any, res: any) {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      const keys = await redis.keys('products:*');
      if (keys.length > 0) await redis.del(...keys);
      res.json({ success: true, data: product });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  },
  async deleteProduct(req: any, res: any) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      const keys = await redis.keys('products:*');
      if (keys.length > 0) await redis.del(...keys);
      res.json({ success: true, message: 'Product deleted' });
    } catch (error: any) { res.status(400).json({ success: false, error: error.message }); }
  }
};
