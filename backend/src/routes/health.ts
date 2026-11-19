import { Router, type Router as RouterType } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';

const router: RouterType = Router();

/**
 * GET /api/health
 * Reports database connectivity and readiness to read user onboarding flags.
 */
router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    sendSuccess(
      res,
      { status: 'degraded', database: 'disconnected', readiness: 'not_ready' },
      'Server running but database unavailable'
    );
    return;
  }

  try {
    await prisma.user.findFirst({
      select: { mustChangePassword: true, mustCompleteProfile: true },
    });
  } catch {
    sendSuccess(
      res,
      { status: 'ok', database: 'connected', readiness: 'not_ready' },
      'Server running but user data unavailable'
    );
    return;
  }

  sendSuccess(
    res,
    { status: 'ok', database: 'connected', readiness: 'ready' },
    'Server is healthy'
  );
});

export default router;
