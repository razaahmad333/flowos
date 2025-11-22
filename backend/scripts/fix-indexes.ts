import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../src/models/Department';
import Doctor from '../src/models/Doctor';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/flowos';

async function fixIndexes() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check and fix Department indexes
        console.log('\n=== Department Indexes ===');
        const deptIndexes = await Department.collection.getIndexes();
        console.log('Current indexes:', JSON.stringify(deptIndexes, null, 2));

        // Drop the old code_1 index if it exists
        if (deptIndexes.code_1) {
            console.log('Dropping old code_1 index...');
            await Department.collection.dropIndex('code_1');
            console.log('✓ Dropped code_1 index');
        }

        // Ensure the compound index exists
        console.log('Ensuring compound index (hospitalId_1_code_1) exists...');
        await Department.collection.createIndex({ hospitalId: 1, code: 1 }, { unique: true });
        console.log('✓ Compound index created/verified');

        // Check and fix Doctor indexes
        console.log('\n=== Doctor Indexes ===');
        const doctorIndexes = await Doctor.collection.getIndexes();
        console.log('Current indexes:', JSON.stringify(doctorIndexes, null, 2));

        // Drop the old code_1 index if it exists
        if (doctorIndexes.code_1) {
            console.log('Dropping old code_1 index...');
            await Doctor.collection.dropIndex('code_1');
            console.log('✓ Dropped code_1 index');
        }

        // Ensure the compound index exists
        console.log('Ensuring compound index (hospitalId_1_code_1) exists...');
        await Doctor.collection.createIndex({ hospitalId: 1, code: 1 }, { unique: true });
        console.log('✓ Compound index created/verified');

        console.log('\n✅ Index cleanup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error);
        process.exit(1);
    }
}

fixIndexes();
