"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrder = exports.validateLogin = exports.validateRegister = void 0;
const zod_1 = require("zod");
const validateRegister = (req, res, next) => {
    const schema = zod_1.z.object({
        email: zod_1.z.string().email(),
        phone: zod_1.z.string().min(10),
        name: zod_1.z.string().min(2),
        age: zod_1.z.number().min(18),
        password: zod_1.z.string().min(6),
    });
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const schema = zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        phone: zod_1.z.string().min(10).optional(),
        password: zod_1.z.string().min(6),
    }).refine(data => data.email || data.phone, {
        message: "Either email or phone is required",
        path: ["email", "phone"]
    });
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
};
exports.validateLogin = validateLogin;
const validateOrder = (req, res, next) => {
    const schema = zod_1.z.object({
        products: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().min(1)
        })).min(1),
    });
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
};
exports.validateOrder = validateOrder;
