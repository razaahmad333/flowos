import { Request } from 'express';
import { Types } from 'mongoose';

export interface TenantFeatures {
    integrationEnabled: boolean;
    webhookEnabled: boolean;
    customBranding: boolean;
    patientPWA: boolean;
}

export interface TenantContext {
    hospitalId: Types.ObjectId;
    plan: 'lite' | 'dedicated' | 'enterprise';
    features: TenantFeatures;
    user?: {
        id: Types.ObjectId;
        roles: string[];
    };
}

declare global {
    namespace Express {
        interface Request {
            tenant?: TenantContext;
            user?: {
                id: string;
                hospitalId: string;
                roles: string[];
            };
        }
    }
}
