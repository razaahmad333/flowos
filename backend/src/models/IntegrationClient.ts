import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IIntegrationClient extends Document {
    hospitalId: Types.ObjectId;
    name: string;
    clientId: string;
    keys: {
        keyId: string;
        secret: string;
        isActive: boolean;
        createdAt: Date;
    }[];
    allowedIPs?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const IntegrationClientSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        name: { type: String, required: true },
        clientId: { type: String, required: true, unique: true },
        keys: [
            {
                keyId: { type: String, required: true },
                secret: { type: String, required: true },
                isActive: { type: Boolean, default: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
        allowedIPs: { type: [String] },
    },
    { timestamps: true }
);

export default mongoose.model<IIntegrationClient>('IntegrationClient', IntegrationClientSchema);
