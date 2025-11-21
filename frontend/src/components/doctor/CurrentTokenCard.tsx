import React from 'react';
import { Token, TokenStatus } from '../../types/queue';
import { queueApi } from '../../lib/apiClient';

interface CurrentTokenCardProps {
    token: Token | null;
    onStatusUpdate: (token: Token) => void;
    onCallNext: () => void;
}

const CurrentTokenCard: React.FC<CurrentTokenCardProps> = ({ token, onStatusUpdate, onCallNext }) => {
    const handleStatusChange = async (status: TokenStatus) => {
        if (!token) return;
        try {
            const updatedToken = await queueApi.updateStatus(token._id, status);
            onStatusUpdate(updatedToken);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    if (!token) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <h2 className="text-xl font-medium text-gray-900 mb-4">No Patient Currently Called</h2>
                <button
                    onClick={onCallNext}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Call Next Patient
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden border-l-4 border-indigo-500">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Current Patient</p>
                        <h2 className="mt-2 text-4xl font-bold text-gray-900">{token.tokenNumber}</h2>
                        <p className="mt-1 text-xl text-gray-700">{token.patientName}</p>
                        <div className="mt-2">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${token.priority === 'EMERGENCY' ? 'bg-red-100 text-red-800' :
                                    token.priority === 'ELDERLY' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'}`}>
                                {token.priority}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="text-lg font-medium text-indigo-600">{token.status}</p>
                    </div>
                </div>
                <div className="mt-8 flex space-x-4">
                    <button
                        onClick={() => handleStatusChange(TokenStatus.COMPLETED)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Complete
                    </button>
                    <button
                        onClick={() => handleStatusChange(TokenStatus.SKIPPED)}
                        className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CurrentTokenCard;
