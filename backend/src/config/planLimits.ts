export type PlanTier = 'free' | 'pro' | 'business' | 'enterprise';
export type ResourceType = 'departments' | 'doctors' | 'users';

export const PLAN_LIMITS: Record<PlanTier, Record<ResourceType, number>> = {
    free: {
        departments: 3,
        doctors: 3,
        users: 5,
    },
    pro: {
        departments: 10,
        doctors: 15,
        users: 15,
    },
    business: {
        departments: 50,
        doctors: 200,
        users: 100,
    },
    enterprise: {
        departments: 9999,
        doctors: 9999,
        users: 9999,
    },
};

export interface AIFeatures {
    aiETA: boolean;
    aiInsights: boolean;
    aiLoadBalancing: boolean;
    aiSetupAssistant: boolean;
}

export const AI_FEATURES: Record<PlanTier, AIFeatures> = {
    free: {
        aiETA: false,
        aiInsights: false,
        aiLoadBalancing: false,
        aiSetupAssistant: false,
    },
    pro: {
        aiETA: false, // Basic rule-based only, but flag can be false or we can add a 'basic' type. For boolean, let's say false for "AI" ETA.
        aiInsights: false,
        aiLoadBalancing: false,
        aiSetupAssistant: true, // Basic
    },
    business: {
        aiETA: true,
        aiInsights: true, // Basic
        aiLoadBalancing: true, // Basic
        aiSetupAssistant: true,
    },
    enterprise: {
        aiETA: true,
        aiInsights: true,
        aiLoadBalancing: true,
        aiSetupAssistant: true,
    },
};
