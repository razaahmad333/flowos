import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    hospitalId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    roles: string[];
    status: 'ACTIVE' | 'DISABLED';
    hasCompletedOnboarding: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema(
    {
        hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        passwordHash: { type: String, required: true },
        roles: { type: [String], default: ['STAFF'] },
        status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
        hasCompletedOnboarding: { type: Boolean, default: false },
    },
    { timestamps: true }
);

userSchema.index({ hospitalId: 1, email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', userSchema);
