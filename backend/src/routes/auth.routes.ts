import { Router, type Router as RouterType } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth';

const router: RouterType = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
