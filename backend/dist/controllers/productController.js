"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const Product_1 = require("../models/Product");
const database_1 = require("../config/database");
exports.productController = {
    async getAllProducts(req, res) {
        try {
            const { category, search, minPrice, maxPrice, brand, page = 1, limit = 10 } = req.query;
            const cacheKey = `products:${JSON.stringify(req.query)}`;
            let cached = null;
            try {
                cached = await database_1.redis.get(cacheKey);
            }
            catch (redisErr) {
                console.warn('Redis get error:', redisErr);
            }
            if (cached)
                return res.json({ success: true, data: JSON.parse(cached), cached: true });
            const filter = { isActive: true };
            if (category)
                filter.category = category;
            if (brand)
                filter.brand = brand;
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice)
                    filter.price.$gte = Number(minPrice);
                if (maxPrice)
                    filter.price.$lte = Number(maxPrice);
            }
            if (search)
                filter.$text = { $search: search };
            const products = await Product_1.Product.find(filter).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)).populate('pairings');
            try {
                await database_1.redis.set(cacheKey, JSON.stringify(products), 'EX', 300);
            }
            catch (redisErr) {
                console.warn('Redis set error:', redisErr);
            }
            res.json({ success: true, data: products, page: Number(page), limit: Number(limit), total: await Product_1.Product.countDocuments(filter) });
        }
        catch (error) {
            console.error('getAllProducts Error:', error);
            res.status(400).json({ success: false, error: error.message, stack: error.stack });
        }
    },
    async getProductById(req, res) {
        try {
            const product = await Product_1.Product.findById(req.params.id).populate('pairings');
            if (!product)
                return res.status(404).json({ success: false, error: 'Product not found' });
            res.json({ success: true, data: product });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async createProduct(req, res) {
        try {
            const product = await Product_1.Product.create(req.body);
            try {
                const keys = await database_1.redis.keys('products:*');
                if (keys.length > 0)
                    await database_1.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            res.status(201).json({ success: true, data: product });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async updateProduct(req, res) {
        try {
            const product = await Product_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            try {
                const keys = await database_1.redis.keys('products:*');
                if (keys.length > 0)
                    await database_1.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            res.json({ success: true, data: product });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },
    async deleteProduct(req, res) {
        try {
            await Product_1.Product.findByIdAndDelete(req.params.id);
            try {
                const keys = await database_1.redis.keys('products:*');
                if (keys.length > 0)
                    await database_1.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            res.json({ success: true, message: 'Product deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
