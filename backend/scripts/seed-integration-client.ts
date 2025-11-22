import mongoose from 'mongoose';
import IntegrationClient from '../src/models/IntegrationClient';
import Hospital from '../src/models/Hospital';
import { env } from '../src/config/env';

const seed = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create a dummy hospital if not exists
        let hospital = await Hospital.findOne({ code: 'test-hospital' });
        if (!hospital) {
            hospital = await Hospital.create({
                name: 'Test Hospital',
                code: 'test-hospital',
                plan: 'lite'
            });
            console.log('Created Test Hospital');
        }

        // Create Integration Client
        const clientId = 'test-client-id';
        await IntegrationClient.deleteOne({ clientId }); // Clean up old

        await IntegrationClient.create({
            hospitalId: hospital._id,
            name: 'Test Integration',
            clientId,
            keys: [{
                keyId: 'test-key-id',
                secret: 'test-secret',
                isActive: true
            }]
        });

        console.log('Seeded Integration Client');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed', error);
        process.exit(1);
    }
};

seed();
