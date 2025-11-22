import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDepartment extends Document {
    hospitalId: Types.ObjectId;
    name: string;
    code: string;
    externalCode?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        externalCode: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

DepartmentSchema.index({ hospitalId: 1, code: 1 }, { unique: true });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
