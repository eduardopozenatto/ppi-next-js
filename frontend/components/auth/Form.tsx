"use client";

import Link from "next/link";
import type { Mode } from "@/app/types";
import { Input } from "@/components/Input/Input";

interface InputItem {
  type: string;
  placeholder: string;
}

const input_groups: Record<Mode, InputItem[]> = {
  login: [
    { type: "email", placeholder: "E-mail" },
    { type: "password", placeholder: "Senha" },
  ],
  register: [
    { type: "text", placeholder: "Nome completo" },
    { type: "email", placeholder: "E-mail" },
    { type: "number", placeholder: "Matrícula (SIAPE ou discente)" },
    { type: "password", placeholder: "Senha" },
    { type: "password", placeholder: "Confirmar senha" },
  ],
};

export interface AuthFormFieldsProps {
  mode?: Mode;
}

export function AuthFormFields({ mode = "login" }: AuthFormFieldsProps) {
  const inputs = input_groups[mode] ?? [];

  return (
    <section className="flex w-full flex-col">
      <form className="flex flex-col gap-4 sm:gap-5" action="#" onSubmit={(e) => e.preventDefault()}>
        {inputs.map((item, index) => (
          <Input key={index} type={item.type} placeholder={item.placeholder} />
        ))}
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
  );
}
