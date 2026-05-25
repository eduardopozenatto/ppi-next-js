import { Router, type Router as RouterType } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from '../controllers/notifications.controller';

const router: RouterType = Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
