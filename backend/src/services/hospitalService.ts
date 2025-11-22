import Hospital from '../models/Hospital';
import { Types } from 'mongoose';

export const getHospitalById = async (id: Types.ObjectId) => {
    return Hospital.findById(id);
};

export const updateHospitalSettings = async (id: Types.ObjectId, data: any) => {
    // Only allow updating specific fields for now
    const { name, hmis } = data;
    return Hospital.findByIdAndUpdate(id, { name, hmis }, { new: true });
};
