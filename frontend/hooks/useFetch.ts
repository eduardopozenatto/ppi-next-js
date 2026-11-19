"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function extractData<T>(response: unknown): T {
  return (response as { data: T }).data;
}

/**
 * Generic hook for fetching data from the API.
 *
 * @param path - API path (e.g. "/inventory")
 * @param extractor - Function to extract the data from the raw response.
 *   Defaults to `(res: any) => res.data` which works for `ApiResponse<T>`.
 *   For `PaginatedResponse<T>` pass `(res) => res` to keep the full envelope.
 */
export function useFetch<T>(
  path: string | null,
  extractor: (res: unknown) => T = extractData,
): UseFetchResult<T> {
  const [result, setResult] = useState<{
    path: string | null;
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ path, data: null, loading: Boolean(path), error: null });

  if (result.path !== path) {
    setResult({ ...result, path, loading: Boolean(path), error: path ? null : result.error });
  }

  const fetchData = useCallback((isCurrent: () => boolean = () => true) => {
    if (!path) return Promise.resolve();

    return api.get<unknown>(path)
      .then((response) => {
        if (!isCurrent()) return;
        const data = extractor(response);
        setResult((previous) => previous.path === path
          ? { path, data, loading: false, error: null }
          : previous);
      })
      .catch((err: unknown) => {
        if (!isCurrent()) return;
        const error = err instanceof Error ? err.message : "Erro ao carregar dados";
        setResult((previous) => previous.path === path
          ? { ...previous, loading: false, error }
          : previous);
      });
    // Inline extractors must not trigger requests when only their identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    let current = true;
    void fetchData(() => current);
    return () => { current = false; };
  }, [fetchData]);

  const refetch = useCallback(() => {
    if (!path) return Promise.resolve();
    setResult((previous) => ({ ...previous, loading: true, error: null }));
    return fetchData();
  }, [fetchData, path]);

  return { data: result.data, loading: result.loading, error: result.error, refetch };
}
