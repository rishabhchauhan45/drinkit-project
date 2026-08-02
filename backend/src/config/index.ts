import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  mongodbUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  openaiApiKey: process.env.OPENAI_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};

const requiredKeys: (keyof typeof config)[] = ['databaseUrl', 'mongodbUri', 'redisUrl', 'jwtSecret'];

for (const key of requiredKeys) {
  if (!config[key]) {
    throw new Error(`Missing required environment variable for ${key}`);
  }
}
