import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /auth/register-hospital-admin:
 *   post:
 *     summary: Register a new hospital and superadmin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hospitalName
 *               - adminName
 *               - email
 *               - password
 *             properties:
 *               hospitalName:
 *                 type: string
 *               adminName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register-admin', authController.registerHospital);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

export default router;
