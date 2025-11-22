import { Router } from 'express';
import * as hospitalController from '../controllers/hospitalController';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/me', authMiddleware, tenantMiddleware, hospitalController.getMe);
router.patch('/settings', requireRoles('SUPERADMIN'), hospitalController.updateSettings);
router.post('/apply-template', authMiddleware, tenantMiddleware, requireRoles('SUPERADMIN', 'ADMIN'), hospitalController.applyTemplate);

export default router;
