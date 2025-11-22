import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/httpResponses';

export const pingSecure = async (req: Request, res: Response, next: NextFunction) => {
    sendSuccess(res, {
        ok: true,
        hospitalId: req.tenant?.hospitalId,
        clientId: req.integrationClient?.clientId,
        message: 'HMAC Authentication Successful'
    });
};
