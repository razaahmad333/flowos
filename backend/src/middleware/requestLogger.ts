import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';

declare global {
    namespace Express {
        interface Request {
            requestId: string;
        }
    }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    const startTime = Date.now();

    // Log request start
    logger.info({
        msg: 'Incoming Request',
        requestId,
        method: req.method,
        url: req.originalUrl,
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    // Log request completion
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { statusCode } = res;

        // Extract user and tenant info if available (populated by auth/tenant middleware)
        const userId = (req as any).user?.id;
        const hospitalId = (req as any).tenant?.hospitalId || (req as any).user?.hospitalId;
        const roles = (req as any).user?.roles;

        logger.info({
            msg: 'Request Completed',
            requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode,
            duration,
            userId,
            hospitalId,
            roles,
        });
    });

    next();
};
