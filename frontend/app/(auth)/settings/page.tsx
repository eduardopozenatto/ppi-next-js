"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/hooks/useAuth";
import { ProfileSummary } from "./profile/ProfileSummary";
import { CategoriesList } from "@/components/admin/settings/CategoriesList";
import { TagsList } from "@/components/admin/settings/TagsList";
import { PermissionsList } from "@/components/admin/settings/PermissionsList";

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
  { id: "email-reminders", label: "Lembretes de devolução", description: "Receba lembretes próximos à data de devolução (ex: 3 dias antes).", enabled: true, channel: "email" },
  { id: "email-items", label: "Novos itens", description: "Receba e-mail quando novos itens forem adicionados ao sistema.", enabled: false, channel: "email" },
  { id: "push-enable", label: "Ativar notificações", description: "Receba notificações em tempo real no sistema (WebSocket/Push).", enabled: true, channel: "push" },
];

type SettingsTab = "perfil" | "notificacoes" | "tags" | "categorias" | "permissoes";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: string;
  adminOnly: boolean;
}

const TABS: TabConfig[] = [
  { id: "perfil", label: "Perfil", icon: "", adminOnly: false },
  { id: "notificacoes", label: "Notificações", icon: "", adminOnly: false },
  { id: "tags", label: "Tags", icon: "", adminOnly: true },
  { id: "categorias", label: "Categorias", icon: "", adminOnly: true },
  { id: "permissoes", label: "Permissões", icon: "", adminOnly: true },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("perfil");
  const [prefs, setPrefs] = useState(INITIAL_PREFS);

  const isAdmin = user?.tag?.name?.toLowerCase() === "laboratorista";

  const visibleTabs = TABS.filter((tab) => !tab.adminOnly || isAdmin);

  function toggle(id: string) {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  function handleSaveNotifications() {
    // TODO: POST /api/settings/notifications
    addToast({
      variant: "success",
      title: "Preferências salvas",
      message: "Preferências salvas com sucesso.",
    });
  }

  const emailPrefs = prefs.filter((p) => p.channel === "email");
  const pushPrefs = prefs.filter((p) => p.channel === "push");

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Preferências da conta e do ambiente LabControl."
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-[var(--color-border)]">
        <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Abas de configurações">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-[var(--color-text-subtle)] hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === "perfil" && <ProfileSummary />}

        {activeTab === "notificacoes" && (
          <div className="space-y-4">
            {/* E-mail notifications */}
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

            {/* Push notifications */}
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

            <Button type="button" onClick={handleSaveNotifications}>
              💾 Salvar preferências
            </Button>
          </div>
        )}

        {activeTab === "tags" && isAdmin && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Gerenciamento de tags</h2>
              <p className="text-sm text-[var(--color-text-subtle)]">Crie e gerencie tags com permissões predefinidas.</p>
            </div>
            <TagsList />
          </div>
        )}

        {activeTab === "categorias" && isAdmin && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Gerenciamento de categorias</h2>
              <p className="text-sm text-[var(--color-text-subtle)]">Adicione e gerencie categorias de itens.</p>
            </div>
            <CategoriesList />
          </div>
        )}

        {activeTab === "permissoes" && isAdmin && (
          <div className="space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Permissões individuais</h2>
              <p className="text-sm text-[var(--color-text-subtle)]">Gerencie as permissões de cada usuário individualmente.</p>
            </div>
            <PermissionsList />
          </div>
        )}
      </div>
    </div>
  );
}
