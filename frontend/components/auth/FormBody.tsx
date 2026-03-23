"use client";

import { useState } from "react";
import type { Mode } from "@/app/types";
import { FormCard } from "@/components/Body/FormCard";
import { AuthFormFooter } from "@/components/auth/AuthFormFooter";
import { AuthTabsHeader } from "@/components/auth/Header";
import { Input } from "@/components/Input/Input";
import Link from "next/link";

export interface AuthFormBodyProps {
  initialMode?: Mode;
}

export function AuthFormBody({ initialMode = "login" }: AuthFormBodyProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <FormCard>
      <div className="flex w-full flex-col gap-8 sm:gap-10">
        <AuthTabsHeader mode={mode} setMode={setMode} />

        <section className="flex w-full flex-col">
          <form className="flex flex-col gap-4 sm:gap-5" action="#" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <Input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
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
      <AuthFormFooter mode={mode} setMode={setMode} email={email} password={password} />
    </FormCard>
  );
}
