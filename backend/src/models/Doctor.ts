import { Schema, model } from 'mongoose';

const doctorSchema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true }, // DOC001
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Doctor = model('Doctor', doctorSchema);
