import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';

interface RequestContext {
    requestId?: string;
    hospitalId?: string;
    userId?: string;
}

export const httpClient = {
    async request<T = any>(config: AxiosRequestConfig, context: RequestContext = {}): Promise<AxiosResponse<T>> {
        const requestId = context.requestId || uuidv4();
        const startTime = Date.now();

        logger.info({
            msg: 'Outgoing HTTP Request',
            requestId,
            method: config.method?.toUpperCase() || 'GET',
            url: config.url,
            hospitalId: context.hospitalId,
            userId: context.userId,
        });

        try {
            const response = await axios({
                ...config,
                headers: {
                    ...config.headers,
                    'X-Request-Id': requestId,
                },
            });

            const duration = Date.now() - startTime;
            logger.info({
                msg: 'Outgoing HTTP Response',
                requestId,
                method: config.method?.toUpperCase() || 'GET',
                url: config.url,
                status: response.status,
                duration,
                hospitalId: context.hospitalId,
            });

            return response;
        } catch (error: any) {
            const duration = Date.now() - startTime;
            const axiosError = error as AxiosError;

            logger.error({
                msg: 'Outgoing HTTP Request Failed',
                requestId,
                method: config.method?.toUpperCase() || 'GET',
                url: config.url,
                status: axiosError.response?.status,
                duration,
                error: axiosError.message,
                hospitalId: context.hospitalId,
            });

            throw error;
        }
    },

    // Helper methods
    get<T = any>(url: string, config?: AxiosRequestConfig, context?: RequestContext) {
        return this.request<T>({ ...config, method: 'GET', url }, context);
    },

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig, context?: RequestContext) {
        return this.request<T>({ ...config, method: 'POST', url, data }, context);
    },

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig, context?: RequestContext) {
        return this.request<T>({ ...config, method: 'PUT', url, data }, context);
    },

    delete<T = any>(url: string, config?: AxiosRequestConfig, context?: RequestContext) {
        return this.request<T>({ ...config, method: 'DELETE', url }, context);
    },
};
