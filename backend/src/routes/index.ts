import { Router, type Router as RouterType } from 'express';
import healthRouter from './health';

const router: RouterType = Router();

// ─── Active routes ────────────────────────────
router.use('/health', healthRouter);

// ─── Future routes (Phase 6+) ─────────────────
// router.use('/auth', authRouter);
// router.use('/inventory', inventoryRouter);
// router.use('/loans', loansRouter);
// router.use('/users', usersRouter);
// router.use('/tags', tagsRouter);
// router.use('/categories', categoriesRouter);
// router.use('/notifications', notificationsRouter);
// router.use('/reports', reportsRouter);

export default router;
