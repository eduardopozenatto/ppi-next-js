"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Mode } from "@/app/types";
import { Button } from "@/components/Button/Button";
import { SmallLink } from "@/components/Link/Link";
import { useAuth } from "@/hooks/useAuth";

export interface AuthFormFooterProps {
  mode?: Mode;
  setMode?: (mode: Mode) => void;
  email?: string;
  password?: string;
}

export function AuthFormFooter({
  mode = "login",
  setMode = () => {},
  email = "",
  password = "",
}: AuthFormFooterProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hint: Record<Mode, string> = {
    login: "Não possui cadastro?",
    register: "Já possui cadastro?",
  };

  const toggleMode = () => {
    setError(null);
    setMode(mode === "login" ? "register" : "login");
  };

  const primaryLabel = mode === "register" ? "Criar conta" : "Entrar";

  function handleSubmit() {
    setError(null);

      if (!email.trim()) {
        setError("Informe o e-mail.");
        return;
      }

      if (!password.trim()) {
        setError("Informe a senha.");
        return;
      }

      setLoading(true);

    if (mode === 'login') {
      // Simulate a small delay for login
      setTimeout(() => {
        const err = login(email, password);
        if (err) {
          setError(err);
          setLoading(false);
        } else {
          router.push("/dashboard");
        }
      }, 300);


    } else {
      setTimeout(() => {
      const err = login(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    }, 300);

    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 border-t border-(--color-border) pt-6">
      {error && (
        <p className="w-full rounded-lg border border-(--color-danger)/30 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-(--color-danger) dark:bg-red-900/20">
          {error}
        </p>
      )}
      <Button
        type="button"
        variant="primary"
        className="w-full sm:w-auto"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Carregando..." : primaryLabel}
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-(--color-text-subtle)">
        <span>{hint[mode]}</span>
        <SmallLink content="Clique aqui" onClick={toggleMode} className="text-sm font-semibold" />
      </div>
    </div>
  );
}
