import crypto from 'crypto';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/integration/ping-secure';
const CLIENT_ID = 'test-client-id';
const KEY_ID = 'test-key-id';
const SECRET = 'test-secret';

// Mock setup: We need to insert this client into DB first or assume it exists.
// Since we can't easily insert from here without DB access, we'll assume the user will create it or we can create a script to seed it.
// For now, this script just generates the signature.

const run = async () => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    const body = { test: 'data' };
    const bodyString = JSON.stringify(body);

    // Canonical String Construction
    // METHOD\nPATH\nSORTED_QUERY\nBODY_HASH\nTIMESTAMP\nNONCE\nKEY_ID
    const method = 'POST';
    const path = '/api/v1/integration/ping-secure';
    const sortedQuery = ''; // No query params
    const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex');

    const canonicalString = `${method}\n${path}\n${sortedQuery}\n${bodyHash}\n${timestamp}\n${nonce}\n${KEY_ID}`;

    const signature = crypto
        .createHmac('sha256', SECRET)
        .update(canonicalString)
        .digest('hex');

    console.log('Sending Request...');
    console.log('Canonical String:', JSON.stringify(canonicalString));
    console.log('Signature:', signature);

    try {
        const res = await axios.post(API_URL, body, {
            headers: {
                'x-client-id': CLIENT_ID,
                'x-key-id': KEY_ID,
                'x-timestamp': timestamp,
                'x-nonce': nonce,
                'x-signature': signature,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', res.data);
    } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
    }
};

run();
