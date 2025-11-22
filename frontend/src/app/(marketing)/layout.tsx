import React from 'react';
import Link from 'next/link';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
            <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                                <span className="text-3xl">◎</span> QueueSphere
                            </Link>
                            <nav className="hidden md:ml-10 md:flex space-x-8">
                                <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium">
                                    Home
                                </Link>
                                <Link href="/services" className="text-gray-500 hover:text-gray-900 font-medium">
                                    Services
                                </Link>
                                <Link href="/pricing" className="text-gray-500 hover:text-gray-900 font-medium">
                                    Pricing
                                </Link>
                                <Link href="/about" className="text-gray-500 hover:text-gray-900 font-medium">
                                    About
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-500 hover:text-gray-900 font-medium"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">{children}</main>

            <footer className="bg-gray-900 text-white border-t border-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                Product
                            </h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/services" className="text-base text-gray-300 hover:text-white">
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="text-base text-gray-300 hover:text-white">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <Link href="/about" className="text-base text-gray-300 hover:text-white">
                                        About
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-8">
                        <p className="text-base text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} QueueSphere. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
