import { Router } from 'express';
import authRoutes from './authRoutes';
import hospitalRoutes from './hospitalRoutes';
import departmentRoutes from './departmentRoutes';
import doctorRoutes from './doctorRoutes';
import userRoutes from './userRoutes';
import integrationRoutes from './integrationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/hospital', hospitalRoutes);
router.use('/departments', departmentRoutes);
router.use('/doctors', doctorRoutes);
router.use('/users', userRoutes);
router.use('/integration', integrationRoutes);

export default router;
