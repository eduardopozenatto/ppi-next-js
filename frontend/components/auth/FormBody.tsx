"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FormCard } from "@/components/Body/FormCard";
import { AuthFormFooter } from "@/components/auth/AuthFormFooter";
import { AuthTabsHeader } from "@/components/auth/Header";
import { Input } from "@/components/Input/Input";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AuthFormBody() {
  const { login } = useAuth();
  const router = useRouter();
  const [tipo, setTipo] = useState<"L" | "S" | "local">("S");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputPlaceholder =
    tipo === "local" ? "E-mail ou Usuário local" : "CPF / Matrícula";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    <FormCard className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <AuthTabsHeader />

        <div className="flex rounded-xl bg-[var(--color-bg-subtle)] p-1" role="tablist">
          <button
            type="button"
            onClick={() => setTipo("S")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
              tipo === "S"
                ? "bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
            )}
          >
            SIGAA
          </button>
          <button
            type="button"
            onClick={() => setTipo("L")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
              tipo === "L"
                ? "bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
            )}
          >
            LDAP
          </button>
          <button
            type="button"
            onClick={() => setTipo("local")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm",
              tipo === "local"
                ? "bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm"
                : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
            )}
          >
            Local / Admin
          </button>
        </div>

        <section className="flex w-full flex-col gap-4">
          <Input
            type="text"
            placeholder={inputPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {tipo === "local" && (
            <div className="flex justify-end">
              <Link
                href="/recovery"
                className="text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          )}
        </section>

        {tipo !== "local" && (
          <div className="rounded-xl border border-azure-300 bg-azure-900/10 p-4 text-xs shadow-xs dark:border-azure-700/80 dark:bg-azure-950/70">
            <p className="flex items-center gap-1.5 text-xs font-bold text-azure-950 dark:text-azure-50">
              <span>ℹ️</span> Primeiro acesso?
            </p>
            <p className="mt-1.5 leading-relaxed font-medium text-azure-900 dark:text-azure-200">
              Alunos, professores e servidores efetuam login diretamente com o CPF e a senha institucional. Seu cadastro é criado automaticamente no primeiro login.
            </p>
          </div>
        )}

        <AuthFormFooter loading={loading} error={error} />
      </form>
    </FormCard>
  );
}
