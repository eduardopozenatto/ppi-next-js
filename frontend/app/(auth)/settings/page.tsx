"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import Link from "next/link";

// TODO: substituir por chamada real quando backend estiver pronto

interface NotifPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  channel: "email" | "push";
}

const INITIAL_PREFS: NotifPref[] = [
  { id: "email-loans", label: "Novos empréstimos", description: "Receba e-mail quando um empréstimo for aprovado.", enabled: true, channel: "email" },
  { id: "email-reminders", label: "Lembretes de devolução", description: "Receba lembretes próximos à data de devolução.", enabled: true, channel: "email" },
  { id: "email-items", label: "Novos itens", description: "Receba e-mail quando novos itens forem adicionados.", enabled: false, channel: "email" },
  { id: "push-enable", label: "Ativar notificações", description: "Notificações em tempo real no sistema.", enabled: true, channel: "push" },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
    setSaved(false);
  }

  function handleSave() {
    // TODO: POST /api/settings/notifications
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const emailPrefs = prefs.filter((p) => p.channel === "email");
  const pushPrefs = prefs.filter((p) => p.channel === "push");

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Preferências da conta e do ambiente LabControl."
      />

      <div className="space-y-4">
        {/* Profile Link */}
        <Link
          href="/settings/profile"
          className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">Perfil</h2>
            <p className="text-sm text-[var(--color-text-subtle)]">Nome, e-mail, telefone, foto e senha</p>
          </div>
          <span className="text-[var(--color-primary)]">→</span>
        </Link>

        {/* Notification Preferences */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-[var(--color-text)]">Notificações por e-mail</h2>
          <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
            Configure quais notificações deseja receber por e-mail.
          </p>
          <ul className="mt-4 space-y-3">
            {emailPrefs.map((pref) => (
              <li key={pref.id} className="flex items-center justify-between gap-4 rounded-xl bg-[var(--color-bg-subtle)] px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-[var(--color-text)]">{pref.label}</span>
                  <p className="text-xs text-[var(--color-text-subtle)]">{pref.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pref.enabled}
                  aria-label={pref.label}
                  onClick={() => toggle(pref.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                    pref.enabled ? "bg-[var(--color-primary)]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      pref.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Push Notification Preferences */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-[var(--color-text)]">Notificações push</h2>
          <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
            Controle as notificações em tempo real dentro do sistema.
          </p>
          <ul className="mt-4 space-y-3">
            {pushPrefs.map((pref) => (
              <li key={pref.id} className="flex items-center justify-between gap-4 rounded-xl bg-[var(--color-bg-subtle)] px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-[var(--color-text)]">{pref.label}</span>
                  <p className="text-xs text-[var(--color-text-subtle)]">{pref.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pref.enabled}
                  aria-label={pref.label}
                  onClick={() => toggle(pref.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                    pref.enabled ? "bg-[var(--color-primary)]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      pref.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <Button type="button" onClick={handleSave}>
          Salvar preferências
        </Button>
        {saved && (
          <span className="ml-3 text-sm font-medium text-[var(--color-success)]">Preferências salvas!</span>
        )}
      </div>
    </div>
  );
}
