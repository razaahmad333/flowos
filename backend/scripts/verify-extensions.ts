import axios from 'axios';
import { expect } from 'chai';

const API_URL = 'http://localhost:4000/api/v1';
let adminToken: string;
let hospitalId: string;

async function runVerification() {
    try {
        console.log('Starting Verification...');

        // 1. Register Admin (Onboarding Check)
        console.log('\n1. Registering Admin...');
        const registerRes = await axios.post(`${API_URL}/auth/register-admin`, {
            hospitalName: 'Test Hospital ' + Date.now(),
            adminName: 'Test Admin',
            email: `admin${Date.now()}@test.com`,
            password: 'password123',
        });
        adminToken = registerRes.data.data.token;
        hospitalId = registerRes.data.data.hospital.id;
        const user = registerRes.data.data.user;
        const hospital = registerRes.data.data.hospital;

        if (user.hasCompletedOnboarding !== false) {
            throw new Error('New user should have hasCompletedOnboarding = false');
        }
        if (!hospital.aiFeatures) {
            throw new Error('Hospital response should include aiFeatures');
        }
        console.log('✅ Admin registered, hasCompletedOnboarding is false, aiFeatures present');

        // 2. Complete Onboarding
        console.log('\n2. Completing Onboarding...');
        const onboardingRes = await axios.post(
            `${API_URL}/users/me/complete-onboarding`,
            {},
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        if (onboardingRes.data.data.hasCompletedOnboarding !== true) {
            throw new Error('User should have hasCompletedOnboarding = true after completion');
        }
        console.log('✅ Onboarding completed');

        // 3. Apply Template
        console.log('\n3. Applying Template...');
        const templateRes = await axios.post(
            `${API_URL}/hospital/apply-template`,
            { templateKey: 'generic_clinic' },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log('Template Result:', templateRes.data.data);
        if (templateRes.data.data.departments < 1) {
            throw new Error('Template should create departments');
        }
        console.log('✅ Template applied');

        // 4. Verify Plan Limits (Lite Free = 3 Departments)
        // Template 'generic_clinic' creates 3 departments: General OPD, Nursing, Pharmacy.
        // So we are at 3/3. Creating one more should fail.
        console.log('\n4. Verifying Plan Limits...');
        try {
            await axios.post(
                `${API_URL}/departments`,
                { name: 'Extra Dept', code: 'EXTRA' },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            throw new Error('Should have failed with PLAN_LIMIT_EXCEEDED');
        } catch (error: any) {
            if (error.response?.data?.error === 'Plan limit exceeded') {
                console.log('✅ Plan limit enforced correctly');
            } else {
                console.error('Unexpected error:', error.response?.data || error.message);
                throw error;
            }
        }

        console.log('\n✅ All verifications passed!');
    } catch (error: any) {
        console.error('\n❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error Details:', error);
        }
        process.exit(1);
    }
}

runVerification();
