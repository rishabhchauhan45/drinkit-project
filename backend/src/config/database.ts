import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import Redis from 'ioredis';

export const prisma = new PrismaClient();

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    // Stop retrying after 3 attempts
    if (times > 3) return null;
    return Math.min(times * 50, 2000);
  }
});

redis.on('error', (err) => {
  console.warn('⚠️ Redis connection error:', err.message);
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    try {
      if (process.env.MONGODB_URI) {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');
      } else {
        console.warn('⚠️ MONGODB_URI not provided in .env');
      }
    } catch (mongoError: any) {
      console.warn('⚠️ MongoDB connection failed (check your MONGODB_URI in .env):', mongoError.message);
    }

    try {
      await redis.ping();
      console.log('✅ Redis connected');
    } catch (redisError: any) {
      console.warn('⚠️ Redis connection failed, cache will be unavailable:', redisError.message);
    }
  } catch (error) {
    console.error('❌ Database connection error (PostgreSQL):', error);
    process.exit(1);
  }
};
