import { aiSeederService } from './src/services/ai-seeder.service';
import { redis } from './src/config/database';
import mongoose from 'mongoose';

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected. Running seeder...');
    const result = await aiSeederService.seedData();
    console.log('Seeder result:', result);
    
    console.log('Clearing Redis cache...');
    const keys = await redis.keys('products:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} cache keys.`);
    } else {
      console.log('No cache keys to clear.');
    }
    
    console.log('Seed and cache clear complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

run();
