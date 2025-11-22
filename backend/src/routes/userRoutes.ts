import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', requireRoles('SUPERADMIN', 'ADMIN'), userController.getUsers);
router.post('/', requireRoles('SUPERADMIN', 'ADMIN'), userController.createUser);
router.patch('/:id', requireRoles('SUPERADMIN', 'ADMIN'), userController.updateUser);

export default router;
