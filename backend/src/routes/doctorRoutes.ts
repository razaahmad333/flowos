import { Router } from 'express';
import * as doctorController from '../controllers/doctorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { requireRoles } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.get('/', doctorController.getDoctors);
router.post('/', requireRoles('SUPERADMIN', 'ADMIN'), doctorController.createDoctor);
router.patch('/:id', requireRoles('SUPERADMIN', 'ADMIN'), doctorController.updateDoctor);
router.delete('/:id', requireRoles('SUPERADMIN', 'ADMIN'), doctorController.deleteDoctor);

export default router;
