import { Router } from 'express';
import { getDepartments, getDoctors } from '../controllers/metaController';

const router = Router();

router.get('/departments', getDepartments);
router.get('/doctors', getDoctors);

export default router;
