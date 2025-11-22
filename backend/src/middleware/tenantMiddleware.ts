import { Request, Response, NextFunction } from 'express';
import Hospital from '../models/Hospital';
import { sendError } from '../utils/httpResponses';
import { Types } from 'mongoose';

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.hospitalId) {
            // If we support API keys later, logic goes here.
            // For now, require user auth first.
            return sendError(res, 'Tenant context missing', 403, 'TENANT_MISSING');
        }

        const hospital = await Hospital.findById(req.user.hospitalId);

        if (!hospital) {
            return sendError(res, 'Hospital not found', 403, 'HOSPITAL_NOT_FOUND');
        }

        req.tenant = {
            hospitalId: hospital._id as Types.ObjectId,
            plan: hospital.plan,
            features: hospital.features,
            user: {
                id: new Types.ObjectId(req.user.id),
                roles: req.user.roles,
            },
        };

        next();
    } catch (error) {
        return sendError(res, 'Tenant resolution failed', 500, 'TENANT_ERROR');
    }
};
