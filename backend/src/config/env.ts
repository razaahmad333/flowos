import dotenv from 'dotenv';

dotenv.config();

console.log('mongouri', process.env.MONGO_URI);

export const config = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/flowos',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    nodeEnv: process.env.NODE_ENV || 'development',
};
