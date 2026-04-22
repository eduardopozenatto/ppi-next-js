"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
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
  extractor: (res: unknown) => T = (res: any) => res.data,
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!path) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<unknown>(path);
      setData(extractor(res));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
