import { Request, Response, NextFunction } from 'express';
import * as doctorService from '../services/doctorService';
import { sendSuccess, sendError } from '../utils/httpResponses';
import { Types } from 'mongoose';

export const getDoctors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctors = await doctorService.getDoctors(req.tenant!.hospitalId);
        sendSuccess(res, doctors);
    } catch (error) {
        next(error);
    }
};

export const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctor = await doctorService.createDoctor(
            req.tenant!.hospitalId,
            req.body,
            new Types.ObjectId(req.user!.id)
        );
        sendSuccess(res, doctor, 'Doctor created', 201);
    } catch (error) {
        next(error);
    }
};

export const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctor = await doctorService.updateDoctor(
            req.tenant!.hospitalId,
            req.params.id,
            req.body,
            new Types.ObjectId(req.user!.id)
        );
        if (!doctor) return sendError(res, 'Doctor not found', 404);
        sendSuccess(res, doctor, 'Doctor updated');
    } catch (error) {
        next(error);
    }
};

export const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const doctor = await doctorService.deleteDoctor(
            req.tenant!.hospitalId,
            req.params.id,
            new Types.ObjectId(req.user!.id)
        );
        if (!doctor) return sendError(res, 'Doctor not found', 404);
        sendSuccess(res, null, 'Doctor deleted');
    } catch (error) {
        next(error);
    }
};
