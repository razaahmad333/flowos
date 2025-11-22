import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error with context
    logger.error({
        msg: 'Request Error',
        requestId: (req as any).requestId, // Cast to any to access custom properties
        error: message,
        stack: err.stack,
        userId: (req as any).user?.id,
        hospitalId: (req as any).tenant?.hospitalId,
        statusCode,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
