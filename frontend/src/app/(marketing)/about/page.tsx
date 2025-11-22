import React from 'react';

export default function AboutPage() {
    return (
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">About QueueSphere</h2>
                <p className="mt-4 text-lg text-gray-500">
                    Building the intelligent operating system for modern healthcare facilities.
                </p>
            </div>
            <div className="mt-12 max-w-3xl mx-auto prose prose-blue prose-lg text-gray-500">
                <p>
                    QueueSphere was built by engineers and healthcare operations specialists who saw OPD chaos daily.
                    We combined operational expertise with AI-powered decision support to build a system that feels light but acts smart.
                </p>

                <h3>Our Mission</h3>
                <p>
                    To simplify hospital operations through intuitive technology, ensuring that every patient gets the care they need without unnecessary delays.
                </p>

                <h3>Our Vision</h3>
                <p>
                    A world where healthcare logistics are invisible, and the focus is 100% on patient care.
                </p>

                <h3>AI Philosophy</h3>
                <p>
                    <strong>AI as an assistant, not automation.</strong> We believe technology should empower staff, not replace them.
                    Our AI tools are designed to provide insights and recommendations that help your team make better decisions, faster.
                </p>
            </div>
        </div>
    );
}
