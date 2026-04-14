import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '../types/api';

/**
 * Send a standard success response.
 * Shape: { data: T, message: string, success: true }
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void {
  const body: ApiResponse<T> = { data, message, success: true };
  res.status(statusCode).json(body);
}

/**
 * Send a created response (201).
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Created'
): void {
  sendSuccess(res, data, message, 201);
}

/**
 * Send a paginated response.
 * Shape: { data: T[], total, page, perPage, totalPages }
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  perPage: number
): void {
  const totalPages = Math.ceil(total / perPage);
  const body: PaginatedResponse<T> = {
    data,
    total,
    page,
    perPage,
    totalPages,
  };
  res.status(200).json(body);
}
