import mongoose, { Schema, Document } from 'mongoose';
import { TenantFeatures } from '../types/common';

export interface IHospital extends Document {
    name: string;
    code: string;
    plan: 'lite' | 'dedicated' | 'enterprise';
    features: TenantFeatures;
    hmis: {
        apiKey?: string;
        webhookUrl?: string;
        mapping?: {
            departments?: Record<string, string>;
            doctors?: Record<string, string>;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const HospitalSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        plan: { type: String, enum: ['lite', 'dedicated', 'enterprise'], default: 'lite' },
        features: {
            integrationEnabled: { type: Boolean, default: false },
            webhookEnabled: { type: Boolean, default: false },
            customBranding: { type: Boolean, default: false },
            patientPWA: { type: Boolean, default: true },
        },
        hmis: {
            apiKey: { type: String },
            webhookUrl: { type: String },
            mapping: {
                departments: { type: Map, of: String },
                doctors: { type: Map, of: String },
            },
        },
    },
    { timestamps: true }
);

export default mongoose.model<IHospital>('Hospital', HospitalSchema);
