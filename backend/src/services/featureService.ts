import Hospital from '../models/Hospital';
import Department from '../models/Department';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { PLAN_LIMITS, AI_FEATURES, PlanTier, ResourceType } from '../config/planLimits';

export const checkPlanLimit = async (hospitalId: string, resourceType: ResourceType) => {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new Error('Hospital not found');
    }

    const tier = (hospital.planTier as PlanTier) || 'free';
    const limit = PLAN_LIMITS[tier][resourceType];

    let currentCount = 0;
    if (resourceType === 'departments') {
        currentCount = await Department.countDocuments({ hospitalId, isActive: true });
    } else if (resourceType === 'doctors') {
        currentCount = await Doctor.countDocuments({ hospitalId, isActive: true });
    } else if (resourceType === 'users') {
        currentCount = await User.countDocuments({ hospitalId, status: 'ACTIVE' });
    }

    if (currentCount >= limit) {
        const error: any = new Error('Plan limit exceeded');
        error.code = 'PLAN_LIMIT_EXCEEDED';
        error.statusCode = 403;
        error.details = {
            resourceType,
            currentCount,
            limit,
            planTier: tier,
        };
        throw error;
    }
};

export const getHospitalAIFeatures = (planTier: string) => {
    const tier = (planTier as PlanTier) || 'free';
    return AI_FEATURES[tier];
};
