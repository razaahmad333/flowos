'use client';

import React, { useState } from 'react';
import StaffLayout from '../../components/layout/StaffLayout';
import RegistrationForm from '../../components/reception/RegistrationForm';
import RecentTokens from '../../components/reception/RecentTokens';
import { Token } from '../../types/queue';

export default function ReceptionPage() {
    const [recentTokens, setRecentTokens] = useState<Token[]>([]);

    const handleTokenRegistered = (token: Token) => {
        setRecentTokens(prev => [token, ...prev]);
    };

    return (
        <StaffLayout title="Reception Console">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <RegistrationForm onTokenRegistered={handleTokenRegistered} />
                </div>
                <div>
                    <RecentTokens tokens={recentTokens} />
                </div>
            </div>
        </StaffLayout>
    );
}
