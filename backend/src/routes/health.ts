import { Router, type Router as RouterType } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/response';

const router: RouterType = Router();

/**
 * GET /api/health
 * Returns server health status with database connectivity check.
 * Response: ApiResponse<{ status: "ok" | "degraded", database: "connected" | "disconnected" }>
 */
router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(
      res,
      { status: 'ok', database: 'connected' },
      'Server is healthy'
    );
  } catch {
    sendSuccess(
      res,
      { status: 'degraded', database: 'disconnected' },
      'Server running but database unavailable'
    );
  }
});

export default router;
