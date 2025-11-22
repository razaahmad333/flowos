import { Request, Response, NextFunction } from 'express';
import * as hospitalService from '../services/hospitalService';
import * as templateService from '../services/templateService';
import { getHospitalAIFeatures } from '../services/featureService';
import { sendSuccess, sendError } from '../utils/httpResponses';
import { Types } from 'mongoose';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hospital = await hospitalService.getHospitalById(req.tenant!.hospitalId);
        if (!hospital) return sendError(res, 'Hospital not found', 404);

        const aiFeatures = getHospitalAIFeatures(hospital.planTier);

        sendSuccess(res, { ...hospital.toObject(), aiFeatures });
    } catch (error) {
        next(error);
    }
};

export const applyTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { templateKey } = req.body;
        const result = await templateService.applyDefaultTemplate(req.tenant!.hospitalId.toString(), templateKey);
        sendSuccess(res, result, 'Template applied successfully');
    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await hospitalService.updateHospitalSettings(req.tenant!.hospitalId, req.body);
        sendSuccess(res, updated, 'Settings updated');
    } catch (error) {
        next(error);
    }
};
