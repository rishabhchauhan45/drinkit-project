import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import Redis from 'ioredis';

export const prisma = new PrismaClient();

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB connected');

    try {
      await redis.ping();
      console.log('✅ Redis connected');
    } catch (redisError) {
      console.warn('⚠️ Redis connection failed, cache will be unavailable:', redisError);
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};
