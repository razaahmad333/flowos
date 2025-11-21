import { Token } from '../models/Token';
import { Department } from '../models/Department';
import { Doctor } from '../models/Doctor';
import * as queueService from './queueService';
import { emitTokenUpdated, emitTokenCreated } from '../sockets/tokenEvents';

interface CreateTokenPayload {
    patientName: string;
    mobile?: string;
    departmentId: string;
    priority?: 'REGULAR' | 'FOLLOWUP' | 'ELDERLY' | 'EMERGENCY';
}

export const createToken = async (payload: CreateTokenPayload) => {
    // Validate department exists
    const department = await Department.findById(payload.departmentId);
    if (!department) {
        throw new Error('Department not found');
    }

    // Generate token number (simple implementation for now)
    // In a real app, this might need to be atomic or based on a daily counter
    const count = await Token.countDocuments({
        departmentId: payload.departmentId,
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
    });
    const tokenNumber = `${department.code}-${count + 1}`;

    const token = new Token({
        ...payload,
        tokenNumber,
        status: 'WAITING',
    });

    await token.save();

    // Add to Redis Queue
    await queueService.enqueueToken(
        token._id.toString(),
        payload.departmentId,
        payload.priority || 'REGULAR'
    );

    emitTokenCreated(token);

    return token;
};

export const callNextToken = async (departmentId: string, doctorId?: string) => {
    // Get next token from queue
    const next = await queueService.dequeueNextToken(departmentId);
    if (!next) {
        return null;
    }

    const { tokenId } = next;

    // Update Token in DB
    const token = await Token.findByIdAndUpdate(
        tokenId,
        {
            status: 'CALLED',
            doctorId: doctorId || undefined,
        },
        { new: true }
    );

    if (token) {
        emitTokenUpdated(token);
    }

    return token;
};

export const updateTokenStatus = async (
    tokenId: string,
    status: 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'
) => {
    const token = await Token.findByIdAndUpdate(
        tokenId,
        { status },
        { new: true }
    );

    if (!token) {
        throw new Error('Token not found');
    }

    // If completed or skipped, ensure it's removed from queue (just in case)
    if (['COMPLETED', 'SKIPPED'].includes(status)) {
        await queueService.removeTokenFromQueue(
            tokenId,
            token.departmentId.toString()
        );
    }

    return token;
};

export const getQueueSnapshot = async (departmentId: string) => {
    // Get top 10 from Redis
    const tokenIds = await queueService.peekQueue(departmentId, 10);

    if (tokenIds.length === 0) {
        return [];
    }

    // Fetch details from Mongo
    // We want to preserve the order from Redis
    const tokens = await Token.find({ _id: { $in: tokenIds } });

    // Map tokens by ID for easy lookup
    const tokenMap = new Map(tokens.map((t: any) => [t._id.toString(), t]));

    // Return ordered list
    return tokenIds
        .map((id: string) => tokenMap.get(id))
        .filter((t: any) => t) // filter out any nulls if sync issue
        .map((t: any) => ({
            _id: t!._id,
            tokenNumber: t!.tokenNumber,
            patientName: t!.patientName,
            status: t!.status,
            priority: t!.priority,
        }));
};

export const getTokenPosition = async (tokenId: string, departmentId: string) => {
    return await queueService.getPositionInQueue(tokenId, departmentId);
};
