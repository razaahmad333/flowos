import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

export const initSocketServer = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all for Phase 1
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: any) => {
        console.log('Client connected:', socket.id);

        socket.on('join_department', (departmentId: string) => {
            socket.join(`dept:${departmentId}`);
            console.log(`Socket ${socket.id} joined dept:${departmentId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
