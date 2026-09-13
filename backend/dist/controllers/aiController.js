"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = void 0;
const openaiService_1 = require("../services/openaiService");
const database_1 = require("../config/database");
const Product_1 = require("../models/Product");
exports.aiController = {
    async verifyAge(req, res, next) {
        try {
            const { idImage, selfie } = req.body;
            const result = await openaiService_1.openaiService.verifyAge(idImage, selfie);
            if (result.isVerified) {
                await database_1.prisma.user.update({ where: { id: req.user.id }, data: { isVerified: true } });
            }
            res.json({ success: true, message: 'Age verification successful', data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getRecommendations(req, res, next) {
        try {
            const orders = await database_1.prisma.order.findMany({ where: { userId: req.params.userId } });
            const products = orders.flatMap((o) => o.products);
            const result = await openaiService_1.openaiService.getRecommendations(products, {});
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    },
    async getPairings(req, res, next) {
        try {
            const product = await Product_1.Product.findById(req.params.productId);
            if (!product)
                return res.status(404).json({ success: false, message: 'Product not found', errors: [] });
            const result = await openaiService_1.openaiService.suggestPairings(product.name, product.category);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
};
