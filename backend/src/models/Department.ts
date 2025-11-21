import { Schema, model } from 'mongoose';

const departmentSchema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true }, // e.g. OPD, CARD
        hospitalId: { type: String, required: true }, // keep simple for now
    },
    { timestamps: true }
);

export const Department = model('Department', departmentSchema);
