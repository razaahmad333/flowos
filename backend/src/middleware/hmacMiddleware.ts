import { Request, Response, NextFunction } from 'express';
import { verifyHmacSignature } from '../services/hmacService';
import { sendError } from '../utils/httpResponses';
import { logger } from '../config/logger';

// Extend Request type to include integrationClient
declare global {
    namespace Express {
        interface Request {
            integrationClient?: any;
        }
    }
}

export const hmacMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await verifyHmacSignature(req);

        req.integrationClient = client;
        // Also attach tenant context for downstream use
        req.tenant = {
            hospitalId: client.hospitalId,
            plan: 'lite', // Default or fetch from Hospital if needed
            features: {
                integrationEnabled: true, // Implicitly true if they have keys? Or check Hospital?
                webhookEnabled: false,
                customBranding: false,
                patientPWA: false
            }
        };

        next();
    } catch (error: any) {
        logger.warn(`HMAC Auth Failed: ${error.message}`);
        return sendError(res, 'Unauthorized: ' + error.message, 401, 'HMAC_AUTH_FAILED');
    }
};
