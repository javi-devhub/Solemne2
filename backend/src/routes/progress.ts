import { Router } from 'express';

import { getProgress, saveProgress } from '../controllers/progressController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authenticateUser, saveProgress);
router.get('/', authenticateUser, getProgress);
router.get('/:slot', authenticateUser, getProgress);

export default router;