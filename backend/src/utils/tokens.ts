import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

export interface TokenPayload {
    userId: string;
    hospitalId: string;
    roles: string[];
}

export const generateToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
