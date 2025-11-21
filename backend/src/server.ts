import http from 'http';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { redisClient } from './config/redis';
import { initSocketServer } from './sockets/index';

const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server);

const startServer = async () => {
    try {
        // Connect to DB
        await connectDB();

        // Start Server
        server.listen(config.port, () => {
            console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
