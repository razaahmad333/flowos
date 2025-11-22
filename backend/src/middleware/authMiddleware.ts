import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokens';
import { sendError } from '../utils/httpResponses';
import { logger } from '../config/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);
        req.user = {
            id: payload.userId,
            hospitalId: payload.hospitalId,
            roles: payload.roles,
        };
        next();
    } catch (error) {
        logger.warn('Invalid token', error);
        return sendError(res, 'Invalid Token', 401, 'UNAUTHORIZED');
    }
};
