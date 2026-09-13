"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const Product_1 = require("../models/Product");
const database_1 = require("../config/database");
const zod_1 = require("zod");
const productSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name is required'),
    category: zod_1.z.enum(['WHISKEY', 'VODKA', 'RUM', 'GIN', 'WINE', 'BEER', 'SNACKS', 'MIXERS'], {
        errorMap: () => ({ message: 'Invalid category' })
    }),
    subCategory: zod_1.z.string().optional(),
    price: zod_1.z.number().positive('Price must be greater than 0').or(zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).refine(val => val > 0, 'Price must be greater than 0')),
    mrp: zod_1.z.number().optional().or(zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()),
    discount: zod_1.z.number().min(0).optional().or(zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()),
    volume: zod_1.z.string().optional(),
    abv: zod_1.z.number().min(0).optional().or(zod_1.z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()),
    brand: zod_1.z.string().min(1, 'Brand is required'),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    stock: zod_1.z.number().min(0, 'Stock cannot be negative').or(zod_1.z.string().regex(/^\d+$/).transform(Number).refine(val => val >= 0, 'Stock cannot be negative')),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().optional()
});
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
    async getDeals(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const cacheKey = `products:deals:${page}:${limit}`;
            let cached = null;
            try {
                cached = await database_1.redis.get(cacheKey);
            }
            catch (redisErr) {
                console.warn('Redis get error:', redisErr);
            }
            if (cached)
                return res.json({ success: true, data: JSON.parse(cached), cached: true });
            const filter = { isActive: true, discount: { $gt: 0 } };
            const products = await Product_1.Product.find(filter)
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit))
                .populate('pairings');
            try {
                await database_1.redis.set(cacheKey, JSON.stringify(products), 'EX', 300);
            }
            catch (redisErr) {
                console.warn('Redis set error:', redisErr);
            }
            res.json({ success: true, data: products, page: Number(page), limit: Number(limit), total: await Product_1.Product.countDocuments(filter) });
        }
        catch (error) {
            console.error('getDeals Error:', error);
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
    async createProduct(req, res, next) {
        try {
            const validatedData = productSchema.parse(req.body);
            const product = await Product_1.Product.create(validatedData);
            try {
                const keys = await database_1.redis.keys('products:*');
                if (keys.length > 0)
                    await database_1.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            res.status(201).json({ success: true, message: 'Product created successfully', data: product });
        }
        catch (error) {
            next(error);
        }
    },
    async updateProduct(req, res, next) {
        try {
            const validatedData = productSchema.partial().parse(req.body);
            const product = await Product_1.Product.findByIdAndUpdate(req.params.id, validatedData, { new: true });
            if (!product)
                return res.status(404).json({ success: false, message: 'Product not found', errors: [] });
            try {
                const keys = await database_1.redis.keys('products:*');
                if (keys.length > 0)
                    await database_1.redis.del(...keys);
            }
            catch (redisErr) {
                console.warn('Redis cache clear error:', redisErr);
            }
            res.json({ success: true, message: 'Product updated successfully', data: product });
        }
        catch (error) {
            next(error);
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
