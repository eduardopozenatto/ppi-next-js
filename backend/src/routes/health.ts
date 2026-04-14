import { Router, type Router as RouterType } from 'express';
import { sendSuccess } from '../utils/response';

const router: RouterType = Router();

/**
 * GET /api/health
 * Returns server health status.
 * Response: ApiResponse<{ status: "ok" }>
 */
router.get('/', (_req, res) => {
  sendSuccess(res, { status: 'ok' }, 'Server is healthy');
});

export default router;
