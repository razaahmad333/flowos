'use client';

import React, { useEffect, useState, useCallback } from 'react';
import StaffLayout from '../../components/layout/StaffLayout';
import CurrentTokenCard from '../../components/doctor/CurrentTokenCard';
import QueueTable from '../../components/doctor/QueueTable';
import { Token, TokenStatus, Department, Doctor } from '../../types/queue';
import { queueApi } from '../../lib/apiClient';
import { socketClient } from '../../lib/socketClient';

export default function DoctorPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<string>('');
    const [selectedDocId, setSelectedDocId] = useState<string>('');

    const [queue, setQueue] = useState<Token[]>([]);
    const [currentToken, setCurrentToken] = useState<Token | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch Departments on Load
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const depts = await queueApi.getDepartments();
                setDepartments(depts);
                if (depts.length > 0) {
                    setSelectedDeptId(depts[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch departments', err);
            }
        };
        fetchDepts();
    }, []);

    // Fetch Doctors when Dept Changes
    useEffect(() => {
        const fetchDocs = async () => {
            if (!selectedDeptId) return;
            try {
                const docs = await queueApi.getDoctors(selectedDeptId);
                setDoctors(docs);
                if (docs.length > 0) {
                    setSelectedDocId(docs[0]._id);
                } else {
                    setSelectedDocId('');
                }
            } catch (err) {
                console.error('Failed to fetch doctors', err);
            }
        };
        fetchDocs();
    }, [selectedDeptId]);

    const fetchQueue = useCallback(async () => {
        if (!selectedDeptId) return;
        setLoading(true);
        try {
            const tokens = await queueApi.getQueue(selectedDeptId);
            // Filter for waiting tokens
            const waiting = tokens.filter(t => t.status === TokenStatus.WAITING);
            setQueue(waiting);

            // Also check if there is an active token for this doctor/dept
            // For simplicity, we'll check if any token is CALLED/IN_PROGRESS for this doctor
            // In a real app, the backend might return "current token" specifically.
            // Here we filter from the list if the list included all statuses, but getQueue usually returns all.
            const active = tokens.find(t =>
                (t.status === TokenStatus.CALLED || t.status === TokenStatus.IN_PROGRESS) &&
                (selectedDocId ? t.doctorId === selectedDocId : true)
            );
            setCurrentToken(active || null);

        } catch (error) {
            console.error('Failed to fetch queue:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedDeptId, selectedDocId]);

    useEffect(() => {
        fetchQueue();

        if (selectedDeptId) {
            socketClient.connect();
            socketClient.joinDepartment(selectedDeptId);

            socketClient.onTokenCreated((token) => {
                if (token.departmentId === selectedDeptId) {
                    setQueue(prev => [...prev, token]);
                }
            });

            socketClient.onTokenUpdated((updatedToken) => {
                if (updatedToken.departmentId !== selectedDeptId) return;

                // Refresh queue logic or manual update
                // For simplicity/robustness, re-fetching or careful state manipulation:

                setQueue(prev => {
                    // If status changed to non-WAITING, remove
                    if (updatedToken.status !== TokenStatus.WAITING) {
                        return prev.filter(t => t._id !== updatedToken._id);
                    }
                    // Update or Add
                    const index = prev.findIndex(t => t._id === updatedToken._id);
                    if (index !== -1) {
                        const newQueue = [...prev];
                        newQueue[index] = updatedToken;
                        return newQueue;
                    }
                    return [...prev, updatedToken];
                });

                // Update current token if it matches
                setCurrentToken(prev => {
                    if (prev && prev._id === updatedToken._id) {
                        // If it was completed/skipped, clear it
                        if (updatedToken.status === TokenStatus.COMPLETED || updatedToken.status === TokenStatus.SKIPPED) {
                            return null;
                        }
                        return updatedToken;
                    }
                    // If we didn't have a current token, and this one is now CALLED for us
                    if (!prev && (updatedToken.status === TokenStatus.CALLED || updatedToken.status === TokenStatus.IN_PROGRESS)) {
                        if (selectedDocId && updatedToken.doctorId !== selectedDocId) return prev;
                        return updatedToken;
                    }
                    return prev;
                });
            });
        }

        return () => {
            socketClient.offTokenEvents();
            socketClient.disconnect();
        };
    }, [fetchQueue, selectedDeptId, selectedDocId]);

    const handleCallNext = async () => {
        if (!selectedDeptId) return;
        try {
            const token = await queueApi.callNext(selectedDeptId, selectedDocId || undefined);
            if (token) {
                setCurrentToken(token);
                setQueue(prev => prev.filter(t => t._id !== token._id));
            } else {
                alert('No patients in queue');
            }
        } catch (error) {
            console.error('Failed to call next:', error);
            alert('Failed to call next patient');
        }
    };

    const handleStatusUpdate = (token: Token) => {
        if (token.status === TokenStatus.COMPLETED || token.status === TokenStatus.SKIPPED) {
            setCurrentToken(null);
        } else {
            setCurrentToken(token);
        }
    };

    return (
        <StaffLayout title="Doctor Dashboard">
            <div className="mb-6 bg-white p-4 rounded shadow flex gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        value={selectedDeptId}
                        onChange={(e) => setSelectedDeptId(e.target.value)}
                    >
                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                        value={selectedDocId}
                        onChange={(e) => setSelectedDocId(e.target.value)}
                    >
                        <option value="">Any Doctor</option>
                        {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <CurrentTokenCard
                        token={currentToken}
                        onStatusUpdate={handleStatusUpdate}
                        onCallNext={handleCallNext}
                    />
                    <QueueTable tokens={queue} />
                </div>
            )}
        </StaffLayout>
    );
}
