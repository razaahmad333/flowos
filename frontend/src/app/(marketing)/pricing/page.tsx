import React from 'react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Lite Free',
        price: '₹0',
        description: 'Ideal for small clinics just getting started.',
        features: [
            '3 Departments',
            '3 Doctors',
            '5 Staff Users',
            'Patient PWA',
            'No AI Features',
        ],
        aiFeatures: [],
        cta: 'Start for Free',
        href: '/signup',
        mostPopular: false,
    },
    {
        name: 'Lite Pro',
        price: '₹2,999',
        period: '/month',
        description: 'For growing clinics needing smart assistance.',
        features: [
            '10 Departments',
            '15 Doctors',
            '15 Staff Users',
            'Patient PWA + Email',
            'Template Packs',
        ],
        aiFeatures: [
            'AI Setup Assistant (Basic)',
            'AI ETA (Rule-based)',
        ],
        cta: 'Get Started',
        href: '/signup',
        mostPopular: true,
    },
    {
        name: 'Business',
        price: '₹9,999',
        period: '/month',
        description: 'For larger hospitals needing AI insights.',
        features: [
            '50 Departments',
            '200 Doctors',
            '100 Staff Users',
            'Custom Branding',
            'HMAC Integrations',
        ],
        aiFeatures: [
            'AI ETA Predictions (ML)',
            'AI Load Alerts',
            'AI Daily Insights',
            'AI Setup Assistant (Full)',
        ],
        cta: 'Contact Sales',
        href: '/about',
        mostPopular: false,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For multi-location hospitals needing full orchestration.',
        features: [
            'Unlimited Resources',
            'Multi-location',
            'SSO & White-label',
            'Dedicated Support',
        ],
        aiFeatures: [
            'Advanced AI Predictions',
            'AI OPD Orchestration',
            'Predictive Insights',
        ],
        cta: 'Contact Sales',
        href: '/about',
        mostPopular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Pricing</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Plans for every stage of growth
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Choose the plan that fits your clinic's needs. Unlock AI capabilities as you grow.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-4 lg:gap-x-8">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${tier.mostPopular ? 'ring-2 ring-blue-600' : 'border-gray-200'
                                }`}
                        >
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                                {tier.mostPopular ? (
                                    <p className="absolute top-0 -translate-y-1/2 bg-blue-600 text-white px-3 py-0.5 text-sm font-semibold rounded-full transform">
                                        Recommended
                                    </p>
                                ) : null}
                                <p className="mt-4 flex items-baseline text-gray-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                                    {tier.period && <span className="ml-1 text-xl font-semibold text-gray-500">{tier.period}</span>}
                                </p>
                                <p className="mt-6 text-gray-500 text-sm">{tier.description}</p>

                                <div className="mt-6">
                                    <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Core Features</h4>
                                    <ul role="list" className="mt-4 space-y-4">
                                        {tier.features.map((feature) => (
                                            <li key={feature} className="flex">
                                                <svg className="flex-shrink-0 w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="ml-3 text-sm text-gray-500">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {tier.aiFeatures.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wide">AI Capabilities</h4>
                                        <ul role="list" className="mt-4 space-y-4">
                                            {tier.aiFeatures.map((feature) => (
                                                <li key={feature} className="flex">
                                                    <svg className="flex-shrink-0 w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                    </svg>
                                                    <span className="ml-3 text-sm text-gray-500">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <Link
                                href={tier.href}
                                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${tier.mostPopular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
