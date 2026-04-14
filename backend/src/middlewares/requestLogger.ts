import type { Request, Response, NextFunction } from 'express';

/**
 * Simple request logger.
 * Logs: [INFO]  GET /api/health 200 - 3ms
 * Warns: [WARN]  POST /api/auth/login 401 - 12ms
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      console.warn(`[WARN]  ${line}`);
    } else {
      console.log(`[INFO]  ${line}`);
    }
  });

  next();
}
