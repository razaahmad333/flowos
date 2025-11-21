import { z } from 'zod';

export const registerTokenSchema = z.object({
    patientName: z.string().min(1, 'Patient name is required'),
    mobile: z.string().optional(),
    departmentId: z.string().min(1, 'Department ID is required'),
    priority: z.enum(['REGULAR', 'FOLLOWUP', 'ELDERLY', 'EMERGENCY']).optional(),
});

export const callNextSchema = z.object({
    departmentId: z.string().min(1, 'Department ID is required'),
    doctorId: z.string().optional(),
});

export const updateStatusSchema = z.object({
    tokenId: z.string().min(1, 'Token ID is required'),
    status: z.enum(['WAITING', 'CALLED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']),
});
