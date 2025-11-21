export enum TokenStatus {
    WAITING = 'WAITING',
    CALLED = 'CALLED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    SKIPPED = 'SKIPPED',
}

export enum Priority {
    REGULAR = 'REGULAR',
    FOLLOWUP = 'FOLLOWUP',
    ELDERLY = 'ELDERLY',
    EMERGENCY = 'EMERGENCY',
}

export interface Token {
    _id: string;
    tokenNumber: string;
    patientName: string;
    mobile?: string;
    departmentId: string;
    doctorId?: string;
    status: TokenStatus;
    priority: Priority;
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    _id: string;
    name: string;
    code: string;
}

export interface Doctor {
    _id: string;
    name: string;
    departmentId: string;
}

export interface CreateTokenPayload {
    patientName: string;
    mobile?: string;
    departmentId: string;
    doctorId?: string;
    priority?: Priority;
}

export interface UpdateStatusPayload {
    tokenId: string;
    status: TokenStatus;
}
