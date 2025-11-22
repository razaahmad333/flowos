import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDepartment extends Document {
    hospitalId: Types.ObjectId;
    masterDepartmentId?: Types.ObjectId;
    name: string;
    code: string;
    isCustom: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        masterDepartmentId: { type: Schema.Types.ObjectId, ref: 'MasterDepartment' },
        name: { type: String, required: true },
        code: { type: String, required: true },
        isCustom: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

DepartmentSchema.index({ hospitalId: 1, code: 1 }, { unique: true });
DepartmentSchema.index({ hospitalId: 1, masterDepartmentId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
