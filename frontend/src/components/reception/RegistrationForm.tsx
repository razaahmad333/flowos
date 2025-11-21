import React, { useState, useEffect } from 'react';
import { queueApi } from '../../lib/apiClient';
import { Priority, Token, Department, Doctor } from '../../types/queue';

interface RegistrationFormProps {
    onTokenRegistered: (token: Token) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onTokenRegistered }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [formData, setFormData] = useState({
        patientName: '',
        mobile: '',
        departmentId: '',
        doctorId: '',
        priority: Priority.REGULAR,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const depts = await queueApi.getDepartments();
                setDepartments(depts);
                if (depts.length > 0) {
                    setFormData(prev => ({ ...prev, departmentId: depts[0]._id }));
                }
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!formData.departmentId) {
                setDoctors([]);
                return;
            }
            try {
                const docs = await queueApi.getDoctors(formData.departmentId);
                setDoctors(docs);
            } catch (err) {
                console.error('Failed to fetch doctors', err);
            }
        };
        fetchDoctors();
    }, [formData.departmentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = await queueApi.registerToken({
                patientName: formData.patientName,
                mobile: formData.mobile || undefined,
                departmentId: formData.departmentId,
                doctorId: formData.doctorId || undefined,
                priority: formData.priority,
            });
            onTokenRegistered(token);
            // Reset form but keep department/doctor
            setFormData(prev => ({
                ...prev,
                patientName: '',
                mobile: '',
                priority: Priority.REGULAR,
            }));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register token');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Register New Patient</h2>
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        value={formData.patientName}
                        onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                        type="tel"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        value={formData.mobile}
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.departmentId}
                            onChange={e => setFormData({ ...formData, departmentId: e.target.value, doctorId: '' })}
                        >
                            {departments.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Doctor (Optional)</label>
                        <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            value={formData.doctorId}
                            onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                        >
                            <option value="">Any Doctor</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>{doc.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                    >
                        {Object.values(Priority).map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Register Token'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationForm;
