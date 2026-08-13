"use client";

import { useState } from "react";
import { FormCard } from "@/components/Body/FormCard";
import { AuthFormFooter } from "@/components/auth/AuthFormFooter";
import { AuthTabsHeader } from "@/components/auth/Header";
import { Input } from "@/components/Input/Input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AuthFormBody() {
  const [tipo, setTipo] = useState<"L" | "S" | "local">("S");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputPlaceholder =
    tipo === "local" ? "E-mail ou Usuário local" : "CPF / Matrícula";

  return (
    <FormCard className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6">
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

        <section className="flex w-full flex-col">
          <form className="flex flex-col gap-4" action="#" onSubmit={(e) => e.preventDefault()}>
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
          </form>

          {tipo === "local" && (
            <div className="mt-3 flex justify-end">
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
          <div className="rounded-xl border border-blue-200/60 bg-blue-50/80 p-3.5 text-xs text-blue-900 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
            <p className="font-semibold">ℹ️ Primeiro acesso?</p>
            <p className="mt-1 leading-relaxed text-blue-800 dark:text-blue-300">
              Alunos, professores e servidores efetuam login diretamente com o CPF e a senha institucional. Seu cadastro é criado automaticamente no primeiro login.
            </p>
          </div>
        )}
      </div>

      <AuthFormFooter
        tipo={tipo}
        email={email}
        password={password}
      />
    </FormCard>
  );
}
