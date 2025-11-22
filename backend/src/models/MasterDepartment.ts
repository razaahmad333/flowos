import mongoose, { Schema, Document } from 'mongoose';

export interface IMasterDepartment extends Document {
    code: string;
    defaultName: string;
    category?: string;
    description?: string;
    tags?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MasterDepartmentSchema = new Schema(
    {
        code: { type: String, required: true, unique: true },
        defaultName: { type: String, required: true },
        category: { type: String },
        description: { type: String },
        tags: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IMasterDepartment>('MasterDepartment', MasterDepartmentSchema);
