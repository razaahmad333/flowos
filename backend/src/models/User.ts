import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    hospitalId: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    roles: string[];
    status: 'ACTIVE' | 'DISABLED';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        passwordHash: { type: String, required: true },
        roles: {
            type: [String],
            default: ['RECEPTION'],
        },
        status: { type: String, enum: ['ACTIVE', 'DISABLED'], default: 'ACTIVE' },
    },
    { timestamps: true }
);

UserSchema.index({ hospitalId: 1, email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema);
