'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DisplayBoard from '../../../components/display/DisplayBoard';

export default function DepartmentDisplayPage() {
    const params = useParams();
    const departmentId = params.departmentId as string;

    return <DisplayBoard departmentId={departmentId} />;
}
