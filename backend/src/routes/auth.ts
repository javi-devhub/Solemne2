import { Router } from 'express';

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from '../controllers/authController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateUser, getCurrentUser);

export default router;