'use client';

import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome to FlowOS Lite Administration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Active Departments</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Active Doctors</h3>
                    <p className="mt-2 text-3xl font-bold text-green-600">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Staff Users</h3>
                    <p className="mt-2 text-3xl font-bold text-purple-600">--</p>
                </div>
            </div>
        </AppLayout>
    );
}
