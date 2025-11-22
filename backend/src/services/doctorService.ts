import Doctor from '../models/Doctor';
import { Types } from 'mongoose';
import { logAuditEvent } from './auditService';

export const getDoctors = async (hospitalId: Types.ObjectId) => {
    return Doctor.find({ hospitalId, isActive: true }).populate('departmentId', 'name code');
};

export const createDoctor = async (hospitalId: Types.ObjectId, data: any, userId?: Types.ObjectId) => {
    const doctor = await Doctor.create({ ...data, hospitalId });

    await logAuditEvent({
        hospitalId,
        userId,
        action: 'DOCTOR_CREATED',
        module: 'DOCTOR',
        newValue: doctor,
    });

    return doctor;
};

export const updateDoctor = async (hospitalId: Types.ObjectId, id: string, data: any, userId?: Types.ObjectId) => {
    const oldDoc = await Doctor.findOne({ _id: id, hospitalId });
    const updatedDoc = await Doctor.findOneAndUpdate({ _id: id, hospitalId }, data, { new: true });

    if (updatedDoc) {
        await logAuditEvent({
            hospitalId,
            userId,
            action: 'DOCTOR_UPDATED',
            module: 'DOCTOR',
            oldValue: oldDoc,
            newValue: updatedDoc,
        });
    }

    return updatedDoc;
};

export const deleteDoctor = async (hospitalId: Types.ObjectId, id: string, userId?: Types.ObjectId) => {
    const updatedDoc = await Doctor.findOneAndUpdate({ _id: id, hospitalId }, { isActive: false }, { new: true });

    if (updatedDoc) {
        await logAuditEvent({
            hospitalId,
            userId,
            action: 'DOCTOR_DELETED',
            module: 'DOCTOR',
            newValue: { isActive: false },
        });
    }

    return updatedDoc;
};
