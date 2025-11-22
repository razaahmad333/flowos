import mongoose from 'mongoose';
import MasterDepartment from '../src/models/MasterDepartment';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/flowos';

const masterData = [
    // 🌱 Core OPD – good for almost any clinic
    { code: 'GENERAL_OP', defaultName: 'General OPD', tags: ['generic_clinic', 'multispeciality_opd'] },
    { code: 'FAMILY_MED_OP', defaultName: 'Family Medicine OPD', tags: ['generic_clinic', 'multispeciality_opd'] },
    { code: 'INTERNAL_MED_OP', defaultName: 'Internal Medicine OPD', tags: ['multispeciality_opd'] },

    // 👶 Women & Children
    { code: 'PEDIATRICS_OP', defaultName: 'Pediatrics OPD', tags: ['generic_clinic', 'multispeciality_opd', 'child_care'] },
    { code: 'NEONATOLOGY_OP', defaultName: 'Neonatology OPD', tags: ['child_care', 'super_speciality'] },
    { code: 'GYNAE_OP', defaultName: 'Gynecology OPD', tags: ['generic_clinic', 'multispeciality_opd', 'womens_health'] },
    { code: 'OBSTETRICS_OP', defaultName: 'Obstetrics OPD', tags: ['womens_health', 'maternity'] },

    // 🦴 Bones, Joints, Spine
    { code: 'ORTHO_OP', defaultName: 'Orthopedics OPD', tags: ['generic_clinic', 'multispeciality_opd'] },
    { code: 'SPINE_OP', defaultName: 'Spine Clinic', tags: ['orthopedics', 'super_speciality'] },
    { code: 'RHEUMATOLOGY_OP', defaultName: 'Rheumatology OPD', tags: ['orthopedics', 'super_speciality'] },

    // 🫁 Heart, Lung, Endocrine, etc.
    { code: 'CARDIOLOGY_OP', defaultName: 'Cardiology OPD', tags: ['multispeciality_opd', 'super_speciality'] },
    { code: 'PULMONOLOGY_OP', defaultName: 'Pulmonology / Chest OPD', tags: ['multispeciality_opd', 'super_speciality'] },
    { code: 'ENDOCRINOLOGY_OP', defaultName: 'Endocrinology OPD', tags: ['super_speciality'] },
    { code: 'DIABETOLOGY_OP', defaultName: 'Diabetology OPD', tags: ['generic_clinic', 'lifestyle', 'super_speciality'] },
    { code: 'NEPHROLOGY_OP', defaultName: 'Nephrology OPD', tags: ['super_speciality'] },
    { code: 'GASTROENTEROLOGY_OP', defaultName: 'Gastroenterology OPD', tags: ['super_speciality'] },
    { code: 'HEPATOLOGY_OP', defaultName: 'Hepatology OPD', tags: ['super_speciality'] },

    // 🧠 Neuro / Mental Health
    { code: 'NEUROLOGY_OP', defaultName: 'Neurology OPD', tags: ['super_speciality'] },
    { code: 'NEUROSURGERY_OP', defaultName: 'Neurosurgery OPD', tags: ['super_speciality'] },
    { code: 'PSYCHIATRY_OP', defaultName: 'Psychiatry OPD', tags: ['generic_clinic', 'mental_health'] },
    { code: 'PSYCHOLOGY_OP', defaultName: 'Psychology / Counselling', tags: ['mental_health'] },

    // 👁👂 ENT / Eye / Skin
    { code: 'ENT_OP', defaultName: 'ENT OPD', tags: ['generic_clinic', 'multispeciality_opd'] },
    { code: 'OPHTHALMOLOGY_OP', defaultName: 'Ophthalmology OPD', tags: ['generic_clinic', 'multispeciality_opd'] },
    { code: 'DERMATOLOGY_OP', defaultName: 'Dermatology OPD', tags: ['generic_clinic', 'multispeciality_opd', 'cosmetic'] },
    { code: 'DENTAL_OP', defaultName: 'Dental OPD', tags: ['generic_clinic', 'single_speciality_clinic'] },

    // 🧬 Cancer, Pain, Rehab
    { code: 'ONCOLOGY_OP', defaultName: 'Oncology OPD', tags: ['super_speciality'] },
    { code: 'PAIN_CLINIC_OP', defaultName: 'Pain Clinic', tags: ['super_speciality', 'anesthesia'] },
    { code: 'PHYSIOTHERAPY_OP', defaultName: 'Physiotherapy & Rehab', tags: ['generic_clinic', 'multispeciality_opd'] },

    // 👴 Geriatric / Preventive
    { code: 'GERIATRIC_OP', defaultName: 'Geriatric OPD', tags: ['multispeciality_opd'] },
    { code: 'PREVENTIVE_HEALTH_OP', defaultName: 'Preventive Health Checkup', tags: ['health_checkup', 'corporate'] },
    { code: 'VACCINATION_OP', defaultName: 'Vaccination / Immunization', tags: ['generic_clinic', 'child_care', 'preventive'] },

    // 🚨 Emergency & Trauma
    { code: 'EMERGENCY', defaultName: 'Emergency / Casualty', tags: ['emergency', 'triage'] },
    { code: 'TRAUMA_OP', defaultName: 'Trauma Clinic', tags: ['emergency', 'orthopedics'] },

    // 🧪 Diagnostics & Support
    { code: 'LAB_MED', defaultName: 'Laboratory / Pathology', tags: ['diagnostic', 'lab'] },
    { code: 'RADIOLOGY', defaultName: 'Radiology / Imaging', tags: ['diagnostic', 'radiology'] },
    { code: 'SONOGRAPHY', defaultName: 'Ultrasound / Sonography', tags: ['diagnostic', 'radiology'] },

    // 💊 Pharmacy & Billing & Admin
    { code: 'PHARMACY', defaultName: 'Pharmacy', tags: ['support_service'] },
    { code: 'BILLING', defaultName: 'Billing & Cash Counter', tags: ['admin', 'support_service'] },
    { code: 'REGISTRATION', defaultName: 'Registration / Front Desk', tags: ['admin', 'support_service'] },
    { code: 'TPA_DESK', defaultName: 'Insurance / TPA Desk', tags: ['admin', 'insurance'] },

    // 🛏️ IPD / Wards (if you ever extend beyond OPD)
    { code: 'GENERAL_WARD', defaultName: 'General Ward', tags: ['ipd', 'ward'] },
    { code: 'PRIVATE_WARD', defaultName: 'Private Rooms', tags: ['ipd', 'ward'] },
    { code: 'ICU', defaultName: 'Intensive Care Unit', tags: ['ipd', 'critical_care'] },
    { code: 'NICU', defaultName: 'Neonatal ICU', tags: ['ipd', 'critical_care', 'child_care'] },
];


(async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        for (const item of masterData) {
            await MasterDepartment.updateOne(
                { code: item.code },
                { $set: item },
                { upsert: true }
            );
        }
        console.log('Master departments upserted');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await mongoose.disconnect();
    }
})();
