"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    mongodbUri: process.env.MONGODB_URI,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development'
};
const requiredKeys = ['databaseUrl', 'mongodbUri', 'redisUrl', 'jwtSecret'];
for (const key of requiredKeys) {
    if (!exports.config[key]) {
        throw new Error(`Missing required environment variable for ${key}`);
    }
}
