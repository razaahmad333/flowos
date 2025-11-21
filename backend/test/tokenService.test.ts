import * as tokenService from '../src/services/tokenService';
import { Token } from '../src/models/Token';
import { Department } from '../src/models/Department';
import * as queueService from '../src/services/queueService';

// Mock Mongoose Models
jest.mock('../src/models/Department');
jest.mock('../src/services/queueService');
jest.mock('../src/sockets/tokenEvents');
jest.mock('../src/config/redis', () => ({
    redisClient: {
        on: jest.fn(),
    },
}));

const mockSave = jest.fn();
jest.mock('../src/models/Token', () => {
    return {
        Token: jest.fn().mockImplementation((data) => ({
            ...data,
            _id: 'mock-token-id',
            save: mockSave,
        })),
    };
});

// Add static methods to the mocked Token class
(Token as any).countDocuments = jest.fn();
(Token as any).findByIdAndUpdate = jest.fn();
(Token as any).find = jest.fn();

describe('Token Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a token', async () => {
        (Department.findById as jest.Mock).mockResolvedValue({ code: 'OPD' });
        (Token.countDocuments as jest.Mock).mockResolvedValue(10);
        mockSave.mockResolvedValue({});

        const payload = {
            patientName: 'John Doe',
            departmentId: 'dept1',
            priority: 'REGULAR' as const,
        };

        await tokenService.createToken(payload);

        expect(Token).toHaveBeenCalledWith(expect.objectContaining({
            tokenNumber: 'OPD-11',
            status: 'WAITING',
        }));
        expect(queueService.enqueueToken).toHaveBeenCalledWith(
            expect.any(String),
            'dept1',
            'REGULAR'
        );
    });

    it('should call next token', async () => {
        (queueService.dequeueNextToken as jest.Mock).mockResolvedValue({ tokenId: 'token1' });
        (Token.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: 'token1', status: 'CALLED' });

        const result = await tokenService.callNextToken('dept1', 'doc1');

        expect(queueService.dequeueNextToken).toHaveBeenCalledWith('dept1');
        expect(Token.findByIdAndUpdate).toHaveBeenCalledWith(
            'token1',
            { status: 'CALLED', doctorId: 'doc1' },
            { new: true }
        );
        expect(result).toBeDefined();
    });
});
