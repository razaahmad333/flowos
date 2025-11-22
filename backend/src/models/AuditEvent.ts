import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditEvent extends Document {
    hospitalId: Types.ObjectId;
    userId?: Types.ObjectId;
    action: string;
    module: string;
    oldValue?: any;
    newValue?: any;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}

const AuditEventSchema: Schema = new Schema(
    {
        hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        action: { type: String, required: true },
        module: { type: String, required: true },
        oldValue: { type: Schema.Types.Mixed },
        newValue: { type: Schema.Types.Mixed },
        ip: { type: String },
        userAgent: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IAuditEvent>('AuditEvent', AuditEventSchema);
