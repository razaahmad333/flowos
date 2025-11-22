import { Types } from 'mongoose';
import Hospital from '../models/Hospital';
import Department from '../models/Department';
import Doctor from '../models/Doctor';

const TEMPLATES: Record<string, any> = {
    generic_clinic: {
        departments: ['General OPD', 'Nursing', 'Pharmacy'],
        doctors: ['Dr. General Physician'],
    },
    multispeciality_opd: {
        departments: ['General Medicine', 'Pediatrics', 'Orthopedics', 'Gynecology'],
        doctors: ['Dr. Pediatrician', 'Dr. Ortho'],
    },
    single_speciality_opd: {
        departments: ['Consultation', 'Procedures'],
        doctors: ['Dr. Specialist'],
    },
};

export const applyDefaultTemplate = async (hospitalId: string, templateKey: string) => {
    const template = TEMPLATES[templateKey];
    if (!template) {
        throw new Error('Invalid template key');
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new Error('Hospital not found');
    }

    if (hospital.hasAppliedDefaultTemplate) {
        throw new Error('Template already applied');
    }

    // Create Departments
    const departmentMap = new Map<string, Types.ObjectId>();
    for (const deptName of template.departments) {
        const dept = await Department.create({
            hospitalId,
            name: deptName,
            code: deptName.toUpperCase().replace(/\s+/g, '_').slice(0, 10),
            isActive: true,
        });
        departmentMap.set(deptName, dept._id as Types.ObjectId);
    }

    // Create Doctors (assign to first department for simplicity, or random)
    if (template.doctors && template.doctors.length > 0) {
        const firstDeptId = departmentMap.values().next().value;
        if (firstDeptId) {
            for (const docName of template.doctors) {
                await Doctor.create({
                    hospitalId,
                    name: docName,
                    code: docName.toUpperCase().replace(/\s+/g, '_').slice(0, 10),
                    departmentId: firstDeptId,
                    isActive: true,
                });
            }
        }
    }

    // Mark as applied
    hospital.hasAppliedDefaultTemplate = true;
    await hospital.save();

    return {
        departments: template.departments.length,
        doctors: template.doctors?.length || 0,
    };
};
