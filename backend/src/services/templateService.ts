import { Types } from 'mongoose';
import MasterDepartment from '../models/MasterDepartment';
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

    // Create Departments (or update if they exist) using master departments
    const departmentMap = new Map<string, Types.ObjectId>();
    // Find master departments for this template
    const masters = await MasterDepartment.find({ tags: templateKey, isActive: true });
    for (const master of masters) {
        const dept = await Department.findOneAndUpdate(
            { hospitalId, masterDepartmentId: master._id },
            {
                $setOnInsert: {
                    hospitalId,
                    masterDepartmentId: master._id,
                    code: master.code,
                    name: master.defaultName,
                    isCustom: false,
                    isActive: true,
                },
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        departmentMap.set(master.defaultName, dept._id as Types.ObjectId);
    }

    // Create Doctors (assign to first department for simplicity, or random)
    if (template.doctors && template.doctors.length > 0) {
        const firstDeptId = departmentMap.values().next().value;
        if (firstDeptId) {
            for (const docName of template.doctors) {
                const code = docName.toUpperCase().replace(/\s+/g, '_').slice(0, 10);
                await Doctor.findOneAndUpdate(
                    { hospitalId, code },
                    {
                        hospitalId,
                        name: docName,
                        code,
                        departmentId: firstDeptId,
                        isActive: true,
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
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
