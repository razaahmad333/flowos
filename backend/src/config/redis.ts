import Redis from 'ioredis';
import { config } from './env';

export const redisClient = new Redis(config.redisUrl);

redisClient.on('connect', () => {
    console.log('Redis Connected');
});

redisClient.on('error', (err: Error) => {
    console.error('Redis Error:', err);
});
