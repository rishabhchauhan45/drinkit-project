"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const mongodb_1 = require("./config/mongodb");
const redis_1 = __importDefault(require("./config/redis"));
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const startServer = async () => {
    try {
        // 1. Connect to PostgreSQL via Prisma
        await exports.prisma.$connect();
        console.log('✅ PostgreSQL connected successfully via Prisma');
        // 2. Connect to MongoDB
        await (0, mongodb_1.connectMongoDB)();
        // 3. Connect to Redis (verify connection)
        await redis_1.default.ping();
        console.log('✅ Redis connected successfully');
        // Start Express Server
        app_1.default.listen(config_1.config.port, () => {
            console.log(`🚀 Server is running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
            console.log(`📡 API: http://localhost:${config_1.config.port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
