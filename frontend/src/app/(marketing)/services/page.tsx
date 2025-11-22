import React from 'react';

export default function ServicesPage() {
    return (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Services</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Intelligent Modules
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Discover what QueueSphere can do for your healthcare facility.
                    </p>
                </div>

                <div className="mt-16 space-y-16">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">AI OPD Optimization</h3>
                            <p className="mt-4 text-lg text-gray-500">
                                AI predicts waiting times and highlights congestion.
                                Ensure that every patient knows exactly when they will be seen, reducing anxiety and crowding in waiting areas.
                            </p>
                        </div>
                    </div>
                    <hr className="border-gray-200" />

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">AI Load Balancing</h3>
                            <p className="mt-4 text-lg text-gray-500">
                                Automatically identifies when doctors or counters are overloaded.
                                Receive recommendations on when to open a new registration counter or shift staff to manage peak loads.
                            </p>
                        </div>
                    </div>
                    <hr className="border-gray-200" />

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">AI Setup Assistant</h3>
                            <p className="mt-4 text-lg text-gray-500">
                                Suggests departments and doctor templates for new clinics based on best practices.
                                Get your clinic up and running in minutes with intelligent defaults.
                            </p>
                        </div>
                    </div>
                    <hr className="border-gray-200" />

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">AI Insights Dashboard</h3>
                            <p className="mt-4 text-lg text-gray-500">
                                Daily summaries + predictive patterns for Business/Enterprise.
                                Know who your busiest doctor is, what your peak hours are, and where your bottlenecks lie—delivered automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
