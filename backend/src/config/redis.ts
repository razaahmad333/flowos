import { createClient } from 'redis';
import { env } from './env';
import { logger } from './logger';

export const redisClient = createClient({
    url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        logger.error('Redis Connection Error:', error);
    }
};
