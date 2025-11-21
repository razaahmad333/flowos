import { getIO } from './index';

export const emitTokenUpdated = (token: any) => {
    try {
        const io = getIO();
        // Emit to specific department room
        io.to(`dept:${token.departmentId}`).emit('token.updated', token);
    } catch (error) {
        console.error('Failed to emit token update:', error);
    }
};

export const emitTokenCreated = (token: any) => {
    try {
        const io = getIO();
        io.to(`dept:${token.departmentId}`).emit('token.created', token);
    } catch (error) {
        console.error('Failed to emit token created:', error);
    }
};
