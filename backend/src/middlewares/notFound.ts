import type { Request, Response } from 'express';

/**
 * 404 handler for unmatched routes.
 * Returns ApiError shape: { message, statusCode }
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
}
