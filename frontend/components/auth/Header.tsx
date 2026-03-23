"use client";

import type { Mode } from "@/app/types";
import { ButtonLink } from "@/components/Button/Link";
import { cn } from "@/lib/utils";

export interface AuthHeaderProps {
  mode?: Mode;
  setMode?: (mode: Mode) => void;
}

export function AuthTabsHeader({ mode = "login", setMode = () => {} }: AuthHeaderProps) {
  const inactive = cn(
    "bg-transparent text-[var(--color-text)] shadow-none ring-0 hover:bg-[var(--color-bg-subtle)]"
  );
  const active = cn(
    "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
  );

  return (
    <div
      className="mt-2 flex w-full gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/80 p-1 sm:mt-4"
      role="tablist"
      aria-label="Entrar ou cadastrar"
    >
      <ButtonLink
        content="Login"
        onClick={() => setMode("login")}
        role="tab"
        aria-selected={mode === "login"}
        id="tab-login"
        className={cn(
          "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all sm:text-base",
          mode === "login" ? active : inactive
        )}
      />
      <ButtonLink
        content="Cadastre-se"
        onClick={() => setMode("register")}
        role="tab"
        aria-selected={mode === "register"}
        id="tab-register"
        className={cn(
          "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all sm:text-base",
          mode === "register" ? active : inactive
        )}
      />
    </div>
  );
}
