"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { PasswordResetForce } from "../auth/PasswordResetForce";
import { FirstLoginWelcomeModal } from "../auth/FirstLoginWelcomeModal";

export interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { status, user } = useAuth();
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

  if (user?.mustChangePassword) {
    return <PasswordResetForce />;
  }

  return (
    <>
      {children}
      {user?.mustCompleteProfile && <FirstLoginWelcomeModal />}
    </>
  );
}
