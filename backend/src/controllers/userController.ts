import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/password';
import { sendSuccess, sendError } from '../utils/httpResponses';
import { logAuditEvent } from '../services/auditService';
import { Types } from 'mongoose';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ hospitalId: req.tenant!.hospitalId });
        sendSuccess(res, users);
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, roles, password } = req.body;

        const passwordHash = await hashPassword(password || 'defaultPassword123'); // Should force password set or email invite

        const user = await User.create({
            hospitalId: req.tenant!.hospitalId,
            name,
            email,
            phone,
            roles,
            passwordHash,
        });

        await logAuditEvent({
            hospitalId: req.tenant!.hospitalId,
            userId: new Types.ObjectId(req.user!.id),
            action: 'USER_CREATED',
            module: 'USER',
            newValue: user,
        });

        sendSuccess(res, user, 'User created', 201);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, roles, status } = req.body;
        const oldUser = await User.findOne({ _id: req.params.id, hospitalId: req.tenant!.hospitalId });

        const updatedUser = await User.findOneAndUpdate(
            { _id: req.params.id, hospitalId: req.tenant!.hospitalId },
            { name, roles, status },
            { new: true }
        );

        if (!updatedUser) return sendError(res, 'User not found', 404);

        await logAuditEvent({
            hospitalId: req.tenant!.hospitalId,
            userId: new Types.ObjectId(req.user!.id),
            action: 'USER_UPDATED',
            module: 'USER',
            oldValue: oldUser,
            newValue: updatedUser,
        });

        sendSuccess(res, updatedUser, 'User updated');
    } catch (error) {
        next(error);
    }
};
