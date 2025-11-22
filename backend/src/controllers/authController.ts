import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess, sendError } from '../utils/httpResponses';

export const registerHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Expects: hospitalName, adminName, email, password
        const result = await authService.registerHospitalAdmin(req.body, req.ip, req.headers['user-agent']);
        sendSuccess(res, result, 'Hospital registered successfully', 201);
    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
        if (error.message === 'Invalid credentials') {
            return sendError(res, 'Invalid credentials', 401, 'AUTH_FAILED');
        }
        next(error);
    }
};
