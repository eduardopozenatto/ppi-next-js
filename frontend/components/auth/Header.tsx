"use client";

export function AuthTabsHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] sm:text-2xl">
        Acesse o LabControl
      </h2>
      <p className="text-xs text-[var(--color-text-subtle)] sm:text-sm">
        Informe suas credenciais abaixo para acessar a plataforma.
      </p>
    </div>
  );
}
