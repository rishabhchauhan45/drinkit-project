"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.redis = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const mongoose_1 = __importDefault(require("mongoose"));
const ioredis_1 = __importDefault(require("ioredis"));
exports.prisma = new client_1.PrismaClient();
exports.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379');
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ PostgreSQL connected');
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
        await exports.redis.ping();
        console.log('✅ Redis connected');
    }
    catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
