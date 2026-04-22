/**
 * HTTP API Client — fetch wrapper for LabControl backend.
 *
 * Every request automatically includes:
 * - `credentials: 'include'` (httpOnly JWT cookie transport)
 * - BASE_URL prefix
 * - `Content-Type: application/json` when a body is present
 *
 * Error responses throw `Error(data.message || 'Erro na requisição')`.
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/* ────────────────────────────────────── helpers ─── */

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content — nothing to parse
  if (res.status === 204) return undefined as unknown as T;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data as T;
}

/* ────────────────────────────────────── public API ─── */

export const api = {
  get: <T>(path: string) => request<T>("GET", path),

  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),

  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),

  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),

  del: <T>(path: string, body?: unknown) => request<T>("DELETE", path, body),
};
