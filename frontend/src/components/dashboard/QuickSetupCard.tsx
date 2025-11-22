import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';

interface QuickSetupCardProps {
    onApplied: () => void;
}

const TEMPLATES = [
    { key: 'generic_clinic', name: 'Generic Clinic', desc: 'General OPD, Nursing, Pharmacy' },
    { key: 'multispeciality_opd', name: 'Multi-speciality OPD', desc: 'Medicine, Peds, Ortho, Gynae' },
    { key: 'single_speciality_opd', name: 'Single-speciality', desc: 'Consultation, Procedures' },
];

export default function QuickSetupCard({ onApplied }: QuickSetupCardProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const applyTemplate = async (templateKey: string) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('/hospital/apply-template', { templateKey });
            onApplied();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to apply template');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden shadow rounded-lg mb-8 border border-blue-100">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">✨</span>
                    <h3 className="text-lg leading-6 font-bold text-gray-900">AI Setup Assistant</h3>
                </div>

                <div className="mt-2 max-w-xl text-sm text-gray-600">
                    <p>Our AI recommends these starter templates based on common clinic patterns. Select one to instantly configure your departments and doctors.</p>
                </div>
                {error && (
                    <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {TEMPLATES.map((template) => (
                        <button
                            key={template.key}
                            onClick={() => applyTemplate(template.key)}
                            disabled={loading}
                            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-blue-400 hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex-1 min-w-0">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm font-medium text-gray-900">{template.name}</p>
                                <p className="text-sm text-gray-500 truncate">{template.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
