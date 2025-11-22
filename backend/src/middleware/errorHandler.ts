import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { sendError } from '../utils/httpResponses';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);

    if (err.name === 'ValidationError') {
        return sendError(res, err.message, 400, 'VALIDATION_ERROR');
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        return sendError(res, 'Duplicate key error', 409, 'DUPLICATE_ENTRY');
    }

    return sendError(res, 'Internal Server Error', 500, 'INTERNAL_SERVER_ERROR');
};
