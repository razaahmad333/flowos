import * as queueService from '../src/services/queueService';

// Mock Redis
jest.mock('../src/config/redis', () => ({
    redisClient: {
        zadd: jest.fn(),
        zpopmin: jest.fn(),
        zrange: jest.fn(),
        zrem: jest.fn(),
        zrank: jest.fn(),
    },
}));

import { redisClient } from '../src/config/redis';

describe('Queue Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should enqueue a token with correct score', async () => {
        await queueService.enqueueToken('token1', 'dept1', 'REGULAR');
        expect(redisClient.zadd).toHaveBeenCalledWith(
            'queue:dept:dept1',
            expect.any(Number),
            'token1'
        );
    });

    it('should dequeue the next token', async () => {
        (redisClient.zpopmin as jest.Mock).mockResolvedValue(['token1', '20.123']);
        const result = await queueService.dequeueNextToken('dept1');
        expect(result).toEqual({ tokenId: 'token1', score: '20.123' });
    });

    it('should return null if queue is empty', async () => {
        (redisClient.zpopmin as jest.Mock).mockResolvedValue([]);
        const result = await queueService.dequeueNextToken('dept1');
        expect(result).toBeNull();
    });
});
