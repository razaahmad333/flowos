import { Request, Response } from 'express';
import * as tokenService from '../services/tokenService';
import { registerTokenSchema, callNextSchema, updateStatusSchema } from '../utils/schemas';

export const registerToken = async (req: Request, res: Response) => {
    try {
        const validatedData = registerTokenSchema.parse(req.body);
        const token = await tokenService.createToken(validatedData);
        res.status(201).json(token);
    } catch (error: any) {
        if (error.errors) { // Zod error
            return res.status(400).json({ error: error.errors });
        }
        res.status(400).json({ error: error.message });
    }
};

export const getQueue = async (req: Request, res: Response) => {
    try {
        const { departmentId } = req.query;
        if (!departmentId) {
            return res.status(400).json({ error: 'departmentId is required' });
        }
        const queue = await tokenService.getQueueSnapshot(departmentId as string);
        res.json(queue);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const callNext = async (req: Request, res: Response) => {
    try {
        const validatedData = callNextSchema.parse(req.body);
        const token = await tokenService.callNextToken(validatedData.departmentId, validatedData.doctorId);
        if (!token) {
            return res.status(404).json({ message: 'Queue is empty' });
        }
        res.json(token);
    } catch (error: any) {
        if (error.errors) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    try {
        const validatedData = updateStatusSchema.parse(req.body);
        const token = await tokenService.updateTokenStatus(validatedData.tokenId, validatedData.status);
        res.json(token);
    } catch (error: any) {
        if (error.errors) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
};
