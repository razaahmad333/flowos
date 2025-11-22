'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Building2, Stethoscope, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
    { name: 'Doctors', href: '/dashboard/doctors', icon: Stethoscope },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <span className="text-xl font-bold text-blue-600">FlowOS Lite</span>
                </div>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                )}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
