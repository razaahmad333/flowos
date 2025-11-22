import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/apiClient';

interface OnboardingTourProps {
    onComplete: () => void;
}

const STEPS = [
    {
        title: 'Welcome to QueueSphere',
        content: 'This is your intelligent dashboard. From here you can manage your entire clinic operations with AI assistance.',
    },
    {
        title: 'Departments',
        content: 'Create and manage departments like "General OPD", "Pharmacy", etc. to organize your workflow.',
    },
    {
        title: 'Doctors',
        content: 'Add doctors and assign them to departments. They will appear in your staff directory.',
    },
    {
        title: 'Users',
        content: 'Create accounts for your receptionists, nurses, and other staff members.',
    },
    {
        title: 'Settings',
        content: 'View your hospital details and manage your subscription plan.',
    },
];

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            finishTour();
        }
    };

    const finishTour = async () => {
        setIsVisible(false);
        try {
            await apiClient.post('/users/me/complete-onboarding');
            onComplete();
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <div className="mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        Step {currentStep + 1} of {STEPS.length}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{STEPS[currentStep].title}</h3>
                    <p className="mt-2 text-gray-600">{STEPS[currentStep].content}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={finishTour}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                        Skip Tour
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
