import { Request, Response } from 'express';
import { Department } from '../models/Department';
import { Doctor } from '../models/Doctor';

export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getDoctors = async (req: Request, res: Response) => {
    try {
        const { departmentId } = req.query;
        const query = departmentId ? { departmentId } : {};
        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
