import { redis } from './src/config/database';

async function flush() {
  try {
    console.log('Flushing Redis DB...');
    await redis.flushdb();
    console.log('Redis flushed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to flush redis:', error);
    process.exit(1);
  }
}

flush();
