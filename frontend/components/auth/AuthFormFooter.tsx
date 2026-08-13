"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button/Button";
import { useAuth } from "@/hooks/useAuth";

export interface AuthFormFooterProps {
  tipo?: "L" | "S" | "local";
  email?: string;
  password?: string;
}

export function AuthFormFooter({
  tipo = "S",
  email = "",
  password = "",
}: AuthFormFooterProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);

    if (!email.trim()) {
      setError(tipo === "local" ? "Informe o e-mail ou usuário." : "Informe o CPF ou matrícula.");
      return;
    }

    if (!password.trim()) {
      setError("Informe a senha.");
      return;
    }

    setLoading(true);

    const err = await login(email, password, tipo);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-4 border-t border-[var(--color-border)] pt-6">
      {error && (
        <p className="w-full rounded-lg border border-[var(--color-danger)]/30 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-[var(--color-danger)] dark:bg-red-900/20">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </div>
  );
}
