import { Router } from 'express';
import * as queueController from '../controllers/queueController';

const router = Router();

router.post('/register', queueController.registerToken);
router.get('/list', queueController.getQueue);
router.post('/next', queueController.callNext);
router.post('/status', queueController.updateStatus);

export default router;
