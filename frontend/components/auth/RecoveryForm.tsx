"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { FormCard } from "@/components/Body/FormCard";

export function RecoveryForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: substituir por POST /api/auth/recovery
  }

  return (
    <FormCard className="max-w-md">
      <h2 className="text-center text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
        Recuperação de senha
      </h2>
      <p className="text-center text-sm text-[var(--color-text-subtle)]">
        Enviaremos instruções para o seu e-mail institucional.
      </p>
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <Input type="email" placeholder="seu@email.com" label="E-mail" name="email" />
        <Button type="submit" variant="primary">
          Enviar
        </Button>
        <Link
          href="/login"
          className="text-center text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Voltar ao login
        </Link>
      </form>
    </FormCard>
  );
}
