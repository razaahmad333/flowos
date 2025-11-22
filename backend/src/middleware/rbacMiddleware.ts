import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/httpResponses';

export const requireRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
        }

        const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

        if (!hasRole) {
            return sendError(res, 'Forbidden: Insufficient permissions', 403, 'FORBIDDEN');
        }

        next();
    };
};
