/**
 * API response types — mirrored from frontend/types/api.ts.
 * Any change here MUST be reflected in frontend/types/api.ts.
 */

/** Standard success response */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/** Error response */
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
