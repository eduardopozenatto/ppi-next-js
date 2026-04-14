import type { Request, Response, NextFunction } from 'express';

/**
 * Custom operational error class.
 * Thrown intentionally in controllers/services for expected error conditions.
 * Response shape matches frontend's ApiError interface.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handling middleware — MUST be the last middleware in the chain.
 * Returns responses matching ApiError: { message, statusCode, errors? }
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Unexpected errors — log full stack, return generic message
  console.error('[UNEXPECTED ERROR]', err.stack || err);
  res.status(500).json({
    message: 'Internal Server Error',
    statusCode: 500,
  });
}
