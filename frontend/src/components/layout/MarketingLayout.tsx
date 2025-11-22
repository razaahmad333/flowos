'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <div className="text-2xl font-bold">QueueSphere</div>
                <nav className="flex space-x-4">
                    <Link href="/">Home</Link>
                    <Link href="/services">Services</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/about">About</Link>
                </nav>
                <div>
                    {user ? (
                        <Link href="/dashboard" className="btn-primary">Dashboard</Link>
                    ) : (
                        <Link href="/login" className="btn-primary">Login</Link>
                    )}
                </div>
            </header>
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <footer className="bg-gray-100 text-center p-2">
                © {new Date().getFullYear()} QueueSphere. All rights reserved.
            </footer>
        </div>
    );
}
