import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
    hospitalId: Types.ObjectId;
    name: string;
    code: string;
    externalCode?: string;
    departmentId: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DoctorSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        externalCode: { type: String },
        departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

DoctorSchema.index({ hospitalId: 1, code: 1 }, { unique: true });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
