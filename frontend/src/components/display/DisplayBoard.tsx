import React, { useEffect, useState } from 'react';
import { Token, TokenStatus, Department } from '../../types/queue';
import { queueApi } from '../../lib/apiClient';
import { socketClient } from '../../lib/socketClient';

interface DisplayBoardProps {
    departmentId: string;
}

const DisplayBoard: React.FC<DisplayBoardProps> = ({ departmentId }) => {
    const [calledTokens, setCalledTokens] = useState<Token[]>([]);
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Department Details
                const depts = await queueApi.getDepartments();
                const currentDept = depts.find(d => d._id === departmentId);
                setDepartment(currentDept || null);

                // Fetch Queue
                const tokens = await queueApi.getQueue(departmentId);
                // Filter for CALLED or IN_PROGRESS
                const active = tokens.filter(t =>
                    t.status === TokenStatus.CALLED || t.status === TokenStatus.IN_PROGRESS
                );
                setCalledTokens(active);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        socketClient.connect();
        socketClient.joinDepartment(departmentId);

        socketClient.onTokenUpdated((updatedToken) => {
            if (updatedToken.departmentId !== departmentId) return;

            setCalledTokens(prev => {
                // If status is no longer active, remove
                if (updatedToken.status !== TokenStatus.CALLED && updatedToken.status !== TokenStatus.IN_PROGRESS) {
                    return prev.filter(t => t._id !== updatedToken._id);
                }

                // Update or Add
                const index = prev.findIndex(t => t._id === updatedToken._id);
                if (index !== -1) {
                    const newTokens = [...prev];
                    newTokens[index] = updatedToken;
                    return newTokens;
                }
                return [updatedToken, ...prev];
            });
        });

        return () => {
            socketClient.offTokenEvents();
            socketClient.disconnect();
        };
    }, [departmentId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <header className="mb-12 border-b border-gray-700 pb-6">
                <h1 className="text-5xl font-bold text-center tracking-wider">
                    NOW SERVING
                    <span className="block text-2xl text-gray-400 mt-2 font-normal">
                        {department ? department.name : 'Unknown Department'}
                    </span>
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {calledTokens.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 text-3xl mt-20">
                        Please wait...
                    </div>
                ) : (
                    calledTokens.map((token) => (
                        <div key={token._id} className="bg-gray-800 rounded-xl border-l-8 border-green-500 p-8 shadow-2xl transform transition-all duration-500 hover:scale-105">
                            <div className="text-gray-400 text-xl uppercase tracking-widest mb-2">Token Number</div>
                            <div className="text-7xl font-bold text-white mb-4">{token.tokenNumber}</div>
                            <div className="flex justify-between items-end border-t border-gray-700 pt-4">
                                <div>
                                    <div className="text-gray-500 text-sm uppercase">Patient</div>
                                    <div className="text-xl truncate max-w-[200px]">{token.patientName}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-sm uppercase">Doctor</div>
                                    <div className="text-xl text-green-400">Room 1</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DisplayBoard;
