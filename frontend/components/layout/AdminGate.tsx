"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isLabAdmin } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export interface AdminGateProps {
  children: ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !user) return;
    if (!isLabAdmin(user)) {
      router.replace("/dashboard");
    }
  }, [status, user, router]);

  if (status !== "authenticated" || !user || !isLabAdmin(user)) {
    return (
      <div
        className={cn(
          "flex min-h-dvh items-center justify-center bg-[var(--color-bg-subtle)]",
          "text-sm text-[var(--color-text-subtle)]"
        )}
        role="status"
      >
        A verificar permissões…
      </div>
    );
  }

  return <>{children}</>;
}
