import 'dotenv/config';
import app from './app';
import { config } from './config';
import { connectMongoDB } from './config/mongodb';
import redisClient from './config/redis';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // 1. Connect to PostgreSQL via Prisma
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully via Prisma');

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Connect to Redis (verify connection)
    await redisClient.ping();
    console.log('✅ Redis connected successfully');

    // Start Express Server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`📡 API: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
