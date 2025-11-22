import { Router } from 'express';
import * as departmentController from '../controllers/departmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', departmentController.getDepartments);
router.post('/', requireRoles('SUPERADMIN', 'ADMIN'), departmentController.createDepartment);
router.patch('/:id', requireRoles('SUPERADMIN', 'ADMIN'), departmentController.updateDepartment);
router.delete('/:id', requireRoles('SUPERADMIN', 'ADMIN'), departmentController.deleteDepartment);

export default router;
