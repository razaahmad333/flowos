import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';

const startServer = async () => {
    await connectDB();
    await connectRedis();

    app.listen(env.PORT, () => {
        logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
};

startServer();
