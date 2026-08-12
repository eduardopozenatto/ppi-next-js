"use client";

import { useState } from "react";
import type { Mode } from "@/app/types";
import { FormCard } from "@/components/Body/FormCard";
import { AuthFormFooter } from "@/components/auth/AuthFormFooter";
import { AuthTabsHeader } from "@/components/auth/Header";
import { Input } from "@/components/Input/Input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface AuthFormBodyProps {
  initialMode?: Mode;
}

export function AuthFormBody({ initialMode = "login" }: AuthFormBodyProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [tipo, setTipo] = useState<"L" | "S" | "local">("S");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputPlaceholder =
    mode === "login"
      ? tipo === "local"
        ? "E-mail ou Usuário local"
        : "CPF / Matrícula"
      : "E-mail";

  return (
    <FormCard>
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        <AuthTabsHeader mode={mode} setMode={setMode} />

        {mode === "login" && (
          <div className="flex rounded-xl bg-[var(--color-bg-subtle)] p-1">
            <button
              type="button"
              onClick={() => setTipo("S")}
              className={cn(
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
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
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
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
                "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                tipo === "local"
                  ? "bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm"
                  : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
              )}
            >
              Local / Admin
            </button>
          </div>
        )}

        <section className="flex w-full flex-col">
          <form className="flex flex-col gap-4 sm:gap-5" action="#" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <Input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Input type="text" placeholder={inputPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} />
            {mode === "register" && (
              <Input type="text" placeholder="Matrícula (SIAPE ou discente)" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
            )}
            <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
            {mode === "register" && (
              <Input type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            )}
          </form>

          {mode === "login" ? (
            <div className="mt-3 flex justify-end">
              <Link
                href="/recovery"
                className="text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          ) : null}
        </section>
      </div>
      <AuthFormFooter
        mode={mode}
        setMode={setMode}
        tipo={tipo}
        email={email}
        password={password}
        name={name}
        matricula={matricula}
        confirmPassword={confirmPassword}
      />
    </FormCard>
  );
}
