"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "guest") {
    return (
      <div
        className={cn(
          "flex min-h-dvh items-center justify-center bg-[var(--color-bg-subtle)]",
          "text-sm text-[var(--color-text-subtle)]"
        )}
        role="status"
        aria-live="polite"
      >
        A carregar…
      </div>
    );
  }

  return <>{children}</>;
}
