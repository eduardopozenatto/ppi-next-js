"use client";

import { Button } from "@/components/Button/Button";

export interface AuthFormFooterProps {
  loading?: boolean;
  error?: string | null;
}

export function AuthFormFooter({
  loading = false,
  error = null,
}: AuthFormFooterProps) {
  return (
    <div className="mt-2 flex w-full flex-col items-center gap-4 border-t border-[var(--color-border)] pt-6">
      {error && (
        <p className="w-full rounded-lg border border-[var(--color-danger)]/30 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-[var(--color-danger)] dark:bg-red-900/20">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </div>
  );
}
