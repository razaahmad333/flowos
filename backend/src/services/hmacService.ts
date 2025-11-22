import crypto from 'crypto';
import { Request } from 'express';
import IntegrationClient from '../models/IntegrationClient';
import { redisClient } from '../config/redis';
import { logger } from '../config/logger';
import { env } from '../config/env';

// Configuration constants (could be in env)
const ALLOWED_DRIFT_SECONDS = parseInt(process.env.HMAC_ALLOWED_DRIFT_SECONDS || '300', 10);
const NONCE_TTL_SECONDS = parseInt(process.env.HMAC_NONCE_TTL_SECONDS || '600', 10);

export const buildCanonicalString = (req: Request, timestamp: string, nonce: string, keyId: string): string => {
    const method = req.method.toUpperCase();
    const path = req.baseUrl + req.path; // e.g. /api/v1/integration/ping-secure

    // Sort query params
    const queryKeys = Object.keys(req.query).sort();
    const sortedQuery = queryKeys.map(key => `${key}=${req.query[key]}`).join('&');

    // Hash body
    const bodyString = JSON.stringify(req.body || {});
    const bodyHash = crypto.createHash('sha256').update(bodyString).digest('hex');

    // Canonical string format:
    // METHOD\nPATH\nSORTED_QUERY\nBODY_HASH\nTIMESTAMP\nNONCE\nKEY_ID
    return `${method}\n${path}\n${sortedQuery}\n${bodyHash}\n${timestamp}\n${nonce}\n${keyId}`;
};

export const verifyHmacSignature = async (req: Request) => {
    const clientId = req.headers['x-client-id'] as string;
    const keyId = req.headers['x-key-id'] as string;
    const timestamp = req.headers['x-timestamp'] as string;
    const nonce = req.headers['x-nonce'] as string;
    const signature = req.headers['x-signature'] as string;

    if (!clientId || !keyId || !timestamp || !nonce || !signature) {
        throw new Error('Missing HMAC headers');
    }

    // 1. Timestamp check (Replay protection part 1)
    const now = Math.floor(Date.now() / 1000);
    const reqTime = parseInt(timestamp, 10);
    if (isNaN(reqTime) || Math.abs(now - reqTime) > ALLOWED_DRIFT_SECONDS) {
        throw new Error('Timestamp out of bounds');
    }

    // 2. Nonce check (Replay protection part 2)
    const nonceKey = `nonce:${clientId}:${keyId}:${nonce}`;
    const exists = await redisClient.get(nonceKey);
    if (exists) {
        throw new Error('Nonce already used');
    }

    // 3. Fetch Client and Key
    const client = await IntegrationClient.findOne({ clientId, isActive: true });
    if (!client) {
        throw new Error('Invalid Client ID');
    }

    const keyObj = client.keys.find(k => k.keyId === keyId && k.isActive);
    if (!keyObj) {
        throw new Error('Invalid or inactive Key ID');
    }

    // 4. Verify Signature
    const canonicalString = buildCanonicalString(req, timestamp, nonce, keyId);
    const expectedSignature = crypto
        .createHmac('sha256', keyObj.secret)
        .update(canonicalString)
        .digest('hex');

    // Constant time comparison
    const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );

    if (!isValid) {
        throw new Error('Invalid Signature');
    }

    // 5. Mark nonce as used
    await redisClient.setEx(nonceKey, NONCE_TTL_SECONDS, '1');

    return client;
};
