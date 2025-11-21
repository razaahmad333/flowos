import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Department } from '../models/Department';
import { Doctor } from '../models/Doctor';
import { config } from '../config/env';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Department.deleteMany({});
        await Doctor.deleteMany({});

        // Create Departments
        const departments = await Department.create([
            { name: 'General Medicine', code: 'GEN', hospitalId: 'HOSP001' },
            { name: 'Pediatrics', code: 'PED', hospitalId: 'HOSP001' },
            { name: 'Orthopedics', code: 'ORTH', hospitalId: 'HOSP001' },
        ]);

        console.log('Departments created:', departments.map(d => ({ id: d._id, name: d.name })));

        // Create Doctors
        const doctors = await Doctor.create([
            { name: 'Dr. Smith', code: 'DOC001', departmentId: departments[0]._id },
            { name: 'Dr. Jones', code: 'DOC002', departmentId: departments[0]._id },
            { name: 'Dr. Brown', code: 'DOC003', departmentId: departments[1]._id },
            { name: 'Dr. White', code: 'DOC004', departmentId: departments[2]._id },
        ]);

        console.log('Doctors created:', doctors.map(d => ({ id: d._id, name: d.name })));

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
