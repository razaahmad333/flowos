import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
    {
        tokenNumber: { type: String, required: true }, // "OPD-12"
        patientName: { type: String, required: true },
        mobile: { type: String },
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor' }, // optional
        status: {
            type: String,
            enum: ['WAITING', 'CALLED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'],
            default: 'WAITING',
        },
        priority: {
            type: String,
            enum: ['REGULAR', 'FOLLOWUP', 'ELDERLY', 'EMERGENCY'],
            default: 'REGULAR',
        },
        positionSnapshot: { type: Number, default: 0 }, // optional
    },
    { timestamps: true }
);

export const Token = model('Token', tokenSchema);
