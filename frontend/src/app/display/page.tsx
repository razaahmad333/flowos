'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { queueApi } from '../../lib/apiClient';
import { Department } from '../../types/queue';

export default function DisplayLandingPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [deptId, setDeptId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const depts = await queueApi.getDepartments();
                setDepartments(depts);
                if (depts.length > 0) {
                    setDeptId(depts[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };
        fetchDepts();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (deptId) {
            router.push(`/display/${deptId}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Select Department</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={deptId}
                            onChange={e => setDeptId(e.target.value)}
                        >
                            {departments.map(d => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Go to Display
                    </button>
                </form>
            </div>
        </div>
    );
}
