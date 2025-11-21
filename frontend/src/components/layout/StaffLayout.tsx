import React from 'react';
import Link from 'next/link';

interface StaffLayoutProps {
    children: React.ReactNode;
    title: string;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">FlowOS - {title}</h1>
                    <nav className="space-x-4">
                        <Link href="/reception" className="text-gray-600 hover:text-gray-900">Reception</Link>
                        <Link href="/doctor" className="text-gray-600 hover:text-gray-900">Doctor</Link>
                        <Link href="/display" className="text-gray-600 hover:text-gray-900">Display</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
};

export default StaffLayout;
