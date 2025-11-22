'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiClient } from '@/lib/apiClient';
import { Plus, Pencil } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    roles: string[];
    status: 'ACTIVE' | 'DISABLED';
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', roles: 'RECEPTION' });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await apiClient.get('/users');
            setUsers(res.data.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                roles: [formData.roles],
                ...(formData.password ? { password: formData.password } : {})
            };

            if (editingId) {
                await apiClient.patch(`/users/${editingId}`, payload);
            } else {
                await apiClient.post('/users', payload);
            }
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', roles: 'RECEPTION' });
            setEditingId(null);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user', error);
        }
    };

    const handleEdit = (user: User) => {
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles[0] || 'RECEPTION'
        });
        setEditingId(user._id);
        setShowModal(true);
    };

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: '', email: '', password: '', roles: 'RECEPTION' });
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Pencil className="w-4 h-4" />
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
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit User' : 'Add User'}</h2>
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
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={!!editingId}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black disabled:bg-gray-100"
                                    />
                                </div>
                                {!editingId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        value={formData.roles}
                                        onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-black"
                                    >
                                        <option value="RECEPTION">Reception</option>
                                        <option value="DOCTOR">Doctor</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="NURSE">Nurse</option>
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
