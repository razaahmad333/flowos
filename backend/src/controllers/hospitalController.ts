import { Request, Response, NextFunction } from 'express';
import * as hospitalService from '../services/hospitalService';
import { sendSuccess, sendError } from '../utils/httpResponses';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hospital = await hospitalService.getHospitalById(req.tenant!.hospitalId);
        if (!hospital) {
            return sendError(res, 'Hospital not found', 404);
        }
        sendSuccess(res, hospital);
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
