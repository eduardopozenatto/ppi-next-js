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
  name?: string;
  matricula?: string;
  confirmPassword?: string;
}

export function AuthFormFooter({
  mode = "login",
  setMode = () => {},
  email = "",
  password = "",
  name = "",
  matricula = "",
  confirmPassword = "",
}: AuthFormFooterProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hint: Record<Mode, string> = {
    login: "Não possui cadastro?",
    register: "Já possui cadastro?",
  };

  const toggleMode = () => {
    setError(null);
    setSuccess(null);
    setMode(mode === "login" ? "register" : "login");
  };

  const primaryLabel = mode === "register" ? "Criar conta" : "Entrar";

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError("Informe o e-mail.");
      return;
    }

    if (!password.trim()) {
      setError("Informe a senha.");
      return;
    }

    setLoading(true);

    if (mode === "login") {
      const err = await login(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      // --- REGISTRO ---
      if (!name.trim()) {
        setError("Informe o nome completo.");
        setLoading(false);
        return;
      }

      if (!matricula.trim()) {
        setError("Informe a matrícula.");
        setLoading(false);
        return;
      }

      if (password.length < 4) {
        setError("A senha deve ter pelo menos 4 caracteres.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        setLoading(false);
        return;
      }

      const err = await register(name, email, matricula, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        setSuccess("Conta criada com sucesso! Faça login para acessar o sistema.");
        setLoading(false);
        // Troca para o modo login após cadastro bem-sucedido
        setTimeout(() => {
          setMode("login");
          setSuccess(null);
        }, 2000);
      }
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 border-t border-(--color-border) pt-6">
      {error && (
        <p className="w-full rounded-lg border border-(--color-danger)/30 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-(--color-danger) dark:bg-red-900/20">
          {error}
        </p>
      )}
      {success && (
        <p className="w-full rounded-lg border border-emerald-300/50 bg-emerald-50 px-4 py-2.5 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          {success}
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
