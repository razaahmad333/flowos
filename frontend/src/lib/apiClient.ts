import axios from 'axios';
import { CreateTokenPayload, Token, TokenStatus, Department, Doctor } from '../types/queue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const queueApi = {
    registerToken: async (payload: CreateTokenPayload): Promise<Token> => {
        const response = await apiClient.post('/queue/register', payload);
        return response.data;
    },

    getQueue: async (departmentId: string): Promise<Token[]> => {
        const response = await apiClient.get('/queue/list', {
            params: { departmentId },
        });
        return response.data;
    },

    callNext: async (departmentId: string, doctorId?: string): Promise<Token | null> => {
        try {
            const response = await apiClient.post('/queue/next', {
                departmentId,
                doctorId,
            });
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },

    updateStatus: async (tokenId: string, status: TokenStatus): Promise<Token> => {
        const response = await apiClient.post('/queue/status', {
            tokenId,
            status,
        });
        return response.data;
    },

    getDepartments: async (): Promise<Department[]> => {
        const response = await apiClient.get('/departments');
        return response.data;
    },

    getDoctors: async (departmentId?: string): Promise<Doctor[]> => {
        const response = await apiClient.get('/doctors', {
            params: { departmentId },
        });
        return response.data;
    },
};
