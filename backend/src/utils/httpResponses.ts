import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: Response, message: string, statusCode = 500, code?: string) => {
    return res.status(statusCode).json({
        success: false,
        error: code || 'INTERNAL_SERVER_ERROR',
        message,
    });
};
