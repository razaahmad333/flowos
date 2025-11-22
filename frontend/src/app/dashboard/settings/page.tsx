'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/apiClient';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';

interface Hospital {
    name: string;
    code: string;
    plan: string;
    planTier: 'free' | 'pro' | 'business' | 'enterprise';
    aiFeatures: {
        aiETA: boolean;
        aiInsights: boolean;
        aiLoadBalancing: boolean;
        aiSetupAssistant: boolean;
    };
}

interface Stats {
    departments: number;
    doctors: number;
    users: number;
}

const PLAN_LIMITS = {
    free: { departments: 3, doctors: 3, users: 5 },
    pro: { departments: 10, doctors: 15, users: 15 },
    business: { departments: 50, doctors: 200, users: 100 },
    enterprise: { departments: 9999, doctors: 9999, users: 9999 },
};

export default function SettingsPage() {
    const [hospital, setHospital] = useState<Hospital | null>(null);
    const [stats, setStats] = useState<Stats>({ departments: 0, doctors: 0, users: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hospitalRes, deptsRes, docsRes, usersRes] = await Promise.all([
                    apiClient.get('/hospital/me'),
                    apiClient.get('/departments'),
                    apiClient.get('/doctors'),
                    apiClient.get('/users'),
                ]);

                setHospital(hospitalRes.data.data);
                setStats({
                    departments: deptsRes.data.data.length,
                    doctors: docsRes.data.data.length,
                    users: usersRes.data.data.length,
                });
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <AppLayout><div>Loading...</div></AppLayout>;
    if (!hospital) return <AppLayout><div>Error loading settings</div></AppLayout>;

    const limits = PLAN_LIMITS[hospital.planTier] || PLAN_LIMITS.free;

    const renderUsage = (label: string, current: number, limit: number) => {
        const percentage = Math.min((current / limit) * 100, 100);
        const isNearLimit = percentage >= 80;
        const isAtLimit = current >= limit;

        return (
            <div className="mb-4">
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className={`text-sm font-medium ${isAtLimit ? 'text-red-600' : 'text-gray-500'}`}>
                        {current} / {limit}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${isAtLimit ? 'bg-red-600' : isNearLimit ? 'bg-yellow-400' : 'bg-blue-600'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    const renderAIFeature = (label: string, enabled: boolean) => (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                <span className={`h-2 w-2 rounded-full mr-3 ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className={`text-sm ${enabled ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{label}</span>
            </div>
            {!enabled && <span className="text-xs text-blue-600 font-medium">Upgrade to unlock</span>}
        </div>
    );

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Hospital Details</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Your organization information.</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Hospital Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{hospital.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Hospital Code</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{hospital.code}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Subscription & Usage</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    You are on <span className="font-semibold capitalize text-blue-600">{hospital.planTier} Plan</span>
                                </p>
                            </div>
                            {hospital.planTier !== 'enterprise' && (
                                <Link href="/pricing" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                    Upgrade
                                </Link>
                            )}
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            {renderUsage('Departments', stats.departments, limits.departments)}
                            {renderUsage('Doctors', stats.doctors, limits.doctors)}
                            {renderUsage('Users', stats.users, limits.users)}
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">AI Capabilities</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Intelligent features enabled on your plan.
                            </p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 divide-y divide-gray-100">
                            {renderAIFeature('AI Waiting-Time Estimator', hospital.aiFeatures?.aiETA)}
                            {renderAIFeature('AI Load Balancing', hospital.aiFeatures?.aiLoadBalancing)}
                            {renderAIFeature('AI Auto-Insights', hospital.aiFeatures?.aiInsights)}
                            {renderAIFeature('AI Setup Assistant', hospital.aiFeatures?.aiSetupAssistant)}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
