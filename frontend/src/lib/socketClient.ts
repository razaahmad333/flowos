import { io, Socket } from 'socket.io-client';
import { Token } from '../types/queue';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

class SocketClient {
    private socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(WS_URL, {
                transports: ['websocket'],
                reconnection: true,
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket');
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket');
            });
        }
        return this.socket;
    }

    joinDepartment(departmentId: string) {
        if (this.socket) {
            this.socket.emit('join_department', departmentId);
        }
    }

    onTokenCreated(callback: (token: Token) => void) {
        if (this.socket) {
            this.socket.on('token.created', callback);
        }
    }

    onTokenUpdated(callback: (token: Token) => void) {
        if (this.socket) {
            this.socket.on('token.updated', callback);
        }
    }

    offTokenEvents() {
        if (this.socket) {
            this.socket.off('token.created');
            this.socket.off('token.updated');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export const socketClient = new SocketClient();
