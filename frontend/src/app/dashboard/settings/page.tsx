'use client';

import AppLayout from '@/components/layout/AppLayout';

export default function SettingsPage() {
    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage hospital settings.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">Settings are read-only in Lite version.</p>
            </div>
        </AppLayout>
    );
}
