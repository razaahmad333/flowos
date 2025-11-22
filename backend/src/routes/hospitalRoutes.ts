import { Router } from 'express';
import * as hospitalController from '../controllers/hospitalController';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/me', requireRoles('SUPERADMIN', 'ADMIN'), hospitalController.getMe);
router.patch('/settings', requireRoles('SUPERADMIN'), hospitalController.updateSettings);

export default router;
