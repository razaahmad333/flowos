import Department from '../models/Department';
import { Types } from 'mongoose';
import { logAuditEvent } from './auditService';

export const getDepartments = async (hospitalId: Types.ObjectId) => {
    return Department.find({ hospitalId, isActive: true });
};

export const createDepartment = async (hospitalId: Types.ObjectId, data: any, userId?: Types.ObjectId) => {
    const department = await Department.create({ ...data, hospitalId });

    await logAuditEvent({
        hospitalId,
        userId,
        action: 'DEPARTMENT_CREATED',
        module: 'DEPARTMENT',
        newValue: department,
    });

    return department;
};

export const updateDepartment = async (hospitalId: Types.ObjectId, id: string, data: any, userId?: Types.ObjectId) => {
    const oldDept = await Department.findOne({ _id: id, hospitalId });
    const updatedDept = await Department.findOneAndUpdate({ _id: id, hospitalId }, data, { new: true });

    if (updatedDept) {
        await logAuditEvent({
            hospitalId,
            userId,
            action: 'DEPARTMENT_UPDATED',
            module: 'DEPARTMENT',
            oldValue: oldDept,
            newValue: updatedDept,
        });
    }

    return updatedDept;
};

export const deleteDepartment = async (hospitalId: Types.ObjectId, id: string, userId?: Types.ObjectId) => {
    // Soft delete
    const updatedDept = await Department.findOneAndUpdate({ _id: id, hospitalId }, { isActive: false }, { new: true });

    if (updatedDept) {
        await logAuditEvent({
            hospitalId,
            userId,
            action: 'DEPARTMENT_DELETED',
            module: 'DEPARTMENT',
            newValue: { isActive: false },
        });
    }

    return updatedDept;
};
