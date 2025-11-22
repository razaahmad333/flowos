'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiClient } from '@/lib/apiClient';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Doctor {
    _id: string;
    name: string;
    departmentId: { _id: string; name: string } | string;
    specialization: string;
    isActive: boolean;
}

interface Department {
    _id: string;
    name: string;
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', departmentId: '', specialization: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [docsRes, deptsRes] = await Promise.all([
                apiClient.get('/doctors'),
                apiClient.get('/departments')
            ]);
            setDoctors(docsRes.data.data);
            setDepartments(deptsRes.data.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await apiClient.patch(`/doctors/${editingId}`, formData);
            } else {
                await apiClient.post('/doctors', formData);
            }
            setShowModal(false);
            setFormData({ name: '', departmentId: '', specialization: '' });
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error('Failed to save doctor', error);
        }
    };

    const handleEdit = (doc: Doctor) => {
        const deptId = typeof doc.departmentId === 'object' ? doc.departmentId._id : doc.departmentId;
        setFormData({ name: doc.name, departmentId: deptId, specialization: doc.specialization });
        setEditingId(doc._id);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try {
                await apiClient.delete(`/doctors/${id}`);
                fetchData();
            } catch (error) {
                console.error('Failed to delete doctor', error);
            }
        }
    };

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', departmentId: '', specialization: '' });
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Doctor
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {doctors.map((doc) => (
                                <tr key={doc._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {typeof doc.departmentId === 'object' ? doc.departmentId.name : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.specialization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {doc.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(doc)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(doc._id)} className="text-red-600 hover:text-red-900">
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
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Doctor' : 'Add Doctor'}</h2>
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
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        required
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    />
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
