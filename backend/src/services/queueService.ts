import { redisClient } from '../config/redis';

const getQueueKey = (departmentId: string) => `queue:dept:${departmentId}`;

const PRIORITY_SCORES = {
    EMERGENCY: 1,
    ELDERLY: 5,
    FOLLOWUP: 10,
    REGULAR: 20,
} as const;

type Priority = keyof typeof PRIORITY_SCORES;

export const enqueueToken = async (
    tokenId: string,
    departmentId: string,
    priority: Priority
) => {
    const queueKey = getQueueKey(departmentId);
    const baseScore = PRIORITY_SCORES[priority];
    // Add timestamp to score to ensure FIFO within same priority
    // Using a small fraction of timestamp to not override priority
    const timestampScore = Date.now() / 1000000000000;
    const score = baseScore + timestampScore;

    await redisClient.zadd(queueKey, score, tokenId);
};

export const dequeueNextToken = async (departmentId: string) => {
    const queueKey = getQueueKey(departmentId);
    // zpopmin returns [member, score, member, score, ...]
    const result = await redisClient.zpopmin(queueKey);

    if (result && result.length > 0) {
        return { tokenId: result[0], score: result[1] };
    }
    return null;
};

export const peekQueue = async (departmentId: string, limit: number = 10) => {
    const queueKey = getQueueKey(departmentId);
    return await redisClient.zrange(queueKey, 0, limit - 1);
};

export const requeueTokenToBottom = async (
    tokenId: string,
    departmentId: string
) => {
    const queueKey = getQueueKey(departmentId);
    // Give it a very high score to put it at the end
    const score = 100 + (Date.now() / 1000000000000);
    await redisClient.zadd(queueKey, score, tokenId);
};

export const removeTokenFromQueue = async (
    tokenId: string,
    departmentId: string
) => {
    const queueKey = getQueueKey(departmentId);
    await redisClient.zrem(queueKey, tokenId);
};

export const getPositionInQueue = async (
    tokenId: string,
    departmentId: string
) => {
    const queueKey = getQueueKey(departmentId);
    const rank = await redisClient.zrank(queueKey, tokenId);
    // zrank is 0-based, so return rank + 1 for human readable position
    // if rank is null (not in queue), return null
    return rank !== null ? rank + 1 : null;
};
