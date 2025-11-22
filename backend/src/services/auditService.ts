import AuditEvent from '../models/AuditEvent';
import { Types } from 'mongoose';
import { logger } from '../config/logger';

interface AuditLogParams {
    hospitalId: Types.ObjectId;
    userId?: Types.ObjectId;
    action: string;
    module: string;
    oldValue?: any;
    newValue?: any;
    ip?: string;
    userAgent?: string;
}

export const logAuditEvent = async (params: AuditLogParams) => {
    try {
        await AuditEvent.create(params);
    } catch (error) {
        logger.error('Failed to log audit event', error);
        // Don't throw, audit logging failure shouldn't block main flow
    }
};
