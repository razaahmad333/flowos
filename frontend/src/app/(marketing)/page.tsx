import React from 'react';
import Link from 'next/link';

import MarketingLayout from '@/components/layout/MarketingLayout';

export default function HomePage() {
    return (
        <MarketingLayout>
            <div className="bg-white">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span className="block xl:inline">Run Your OPD Smoothly</span>{' '}
                                        <span className="block text-blue-600 xl:inline">With a Smart, AI-Assisted Queue System.</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        QueueSphere brings order to clinics & hospitals using intelligent patient flow prediction, real-time dashboards, and automated insights — all without replacing your HMIS.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link
                                                href="/signup"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg"
                                            >
                                                Start free with Lite
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link
                                                href="/pricing"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg"
                                            >
                                                View pricing
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
                        {/* Placeholder for hero image */}
                        <div className="text-gray-200 text-9xl font-bold opacity-30 select-none">QueueSphere</div>
                    </div>
                </div>

                {/* AI Features Section */}
                <div className="py-12 bg-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">AI-Powered Operations</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                QueueSphere learns from your OPD patterns
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                Predict waiting times, detect overloads, recommend counter distribution, and summarize daily performance. All automatically.
                            </p>
                        </div>

                        <div className="mt-10">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                {[
                                    {
                                        name: 'AI Waiting-Time Estimator',
                                        description: 'Uses past token movement + doctor speed patterns to estimate patient ETA.',
                                    },
                                    {
                                        name: 'AI Load Balancer',
                                        description: 'Recommends which counters need support and when to deploy extra staff.',
                                    },
                                    {
                                        name: 'AI Auto-Insights',
                                        description: 'Generates short insights: busiest doctor, peak hour, average wait, bottlenecks.',
                                    },
                                    {
                                        name: 'AI Setup Assistant',
                                        description: 'Advises default departments and doctors for faster onboarding.',
                                    },
                                ].map((feature) => (
                                    <div key={feature.name} className="relative bg-white p-6 rounded-lg shadow-sm">
                                        <dt>
                                            <p className="text-lg leading-6 font-bold text-gray-900">{feature.name}</p>
                                        </dt>
                                        <dd className="mt-2 text-base text-gray-500">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="py-12 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                Why choose QueueSphere?
                            </p>
                        </div>
                        <div className="mt-10">
                            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                {[
                                    { name: 'Reduce Waiting Time', desc: 'Keep patients happy with accurate ETAs.' },
                                    { name: 'Identify Bottlenecks', desc: 'Spot delays instantly with real-time dashboards.' },
                                    { name: 'Plug-and-Play', desc: 'Zero IT headaches. Get started in minutes.' },
                                ].map((item) => (
                                    <div key={item.name} className="relative">
                                        <dt>
                                            <p className="text-lg leading-6 font-medium text-gray-900">{item.name}</p>
                                        </dt>
                                        <dd className="mt-2 text-base text-gray-500">{item.desc}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}
