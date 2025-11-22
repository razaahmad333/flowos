import { Router } from 'express';
import * as integrationController from '../controllers/integrationController';
import { hmacMiddleware } from '../middleware/hmacMiddleware';

const router = Router();

router.post('/ping-secure', hmacMiddleware, integrationController.pingSecure);

export default router;
