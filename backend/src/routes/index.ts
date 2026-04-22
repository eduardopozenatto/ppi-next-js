import { Router, type Router as RouterType } from 'express';
import healthRouter from './health';
import authRouter from './auth.routes';
import inventoryRouter from './inventory.routes';
import loansRouter from './loans.routes';

import usersRouter from './users.routes';
import tagsRouter from './tags.routes';
import categoriesRouter from './categories.routes';
import notificationsRouter from './notifications.routes';
import reportsRouter from './reports.routes';

const router: RouterType = Router();

// ─── Active routes ────────────────────────────
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/inventory', inventoryRouter);
router.use('/loans', loansRouter);
router.use('/users', usersRouter);
router.use('/tags', tagsRouter);
router.use('/categories', categoriesRouter);
router.use('/notifications', notificationsRouter);
router.use('/reports', reportsRouter);

export default router;
