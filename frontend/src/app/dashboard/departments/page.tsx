'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiClient } from '@/lib/apiClient';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Department {
    _id: string;
    name: string;
    code: string;
    type: string;
    isActive: boolean;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', type: 'OPD' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchDepartments = async () => {
        try {
            const res = await apiClient.get('/departments');
            setDepartments(res.data.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await apiClient.patch(`/departments/${editingId}`, formData);
            } else {
                await apiClient.post('/departments', formData);
            }
            setShowModal(false);
            setFormData({ name: '', code: '', type: 'OPD' });
            setEditingId(null);
            fetchDepartments();
        } catch (error) {
            console.error('Failed to save department', error);
        }
    };

    const handleEdit = (dept: Department) => {
        setFormData({ name: dept.name, code: dept.code, type: dept.type });
        setEditingId(dept._id);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this department?')) {
            try {
                await apiClient.delete(`/departments/${id}`);
                fetchDepartments();
            } catch (error) {
                console.error('Failed to delete department', error);
            }
        }
    };

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', code: '', type: 'OPD' });
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {departments.map((dept) => (
                                <tr key={dept._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {dept.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(dept._id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Department' : 'Add Department'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    >
                                        <option value="OPD">OPD</option>
                                        <option value="EMERGENCY">Emergency</option>
                                        <option value="IPD">IPD</option>
                                        <option value="LAB">Lab</option>
                                        <option value="PHARMACY">Pharmacy</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
