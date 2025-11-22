import { Request, Response, NextFunction } from 'express';
import * as departmentService from '../services/departmentService';
import { sendSuccess, sendError } from '../utils/httpResponses';
import { Types } from 'mongoose';

export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await departmentService.getDepartments(req.tenant!.hospitalId);
        sendSuccess(res, departments);
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = await departmentService.createDepartment(
            req.tenant!.hospitalId,
            req.body,
            new Types.ObjectId(req.user!.id)
        );
        sendSuccess(res, department, 'Department created', 201);
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = await departmentService.updateDepartment(
            req.tenant!.hospitalId,
            req.params.id,
            req.body,
            new Types.ObjectId(req.user!.id)
        );
        if (!department) return sendError(res, 'Department not found', 404);
        sendSuccess(res, department, 'Department updated');
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const department = await departmentService.deleteDepartment(
            req.tenant!.hospitalId,
            req.params.id,
            new Types.ObjectId(req.user!.id)
        );
        if (!department) return sendError(res, 'Department not found', 404);
        sendSuccess(res, null, 'Department deleted');
    } catch (error) {
        next(error);
    }
};
