import { BASE_URL } from "@/lib/api/client";

/**
 * Resolve a relative backend static file path to a full URL.
 *
 * Backend stores images as relative paths like "uploads/avatars/file.jpg"
 * or "uploads/image-123.jpg". These files are served by the backend at
 * http://localhost:3001/uploads/..., NOT by the Next.js frontend.
 *
 * This helper converts such paths to the correct backend URL.
 *
 * @param relativePath - Path stored in DB (e.g. "uploads/avatars/avatar-xxx.jpg")
 * @returns Full URL (e.g. "http://localhost:3001/uploads/avatars/avatar-xxx.jpg")
 *          or null if path is empty/undefined
 *
 * @example
 * getStaticUrl("uploads/avatars/avatar-123.jpg")
 * // → "http://localhost:3001/uploads/avatars/avatar-123.jpg"
 *
 * getStaticUrl(null)
 * // → null
 */
export function getStaticUrl(relativePath: string | null | undefined): string | null {
  if (!relativePath) return null;

  // Already a full URL — return as-is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }

  // BASE_URL is "http://localhost:3001/api" — we need "http://localhost:3001"
  const backendOrigin = BASE_URL.replace(/\/api\/?$/, "");

  // Normalize: remove leading slash if present
  const clean = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;

  return `${backendOrigin}/${clean}`;
}
