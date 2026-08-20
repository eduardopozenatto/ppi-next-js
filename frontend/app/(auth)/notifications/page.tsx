"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/Button/Button";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { LabNotification, NotificationType } from "@/types/notification";

type FilterTab = "all" | "unread" | "loans" | "system";

/* ---------- SVG Notification Icons ---------- */
function ApprovalIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RejectionIcon() {
  return (
    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ReminderIcon() {
  return (
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function OverdueIcon() {
  return (
    <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg className="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

const TYPE_CONFIG: Record<
  NotificationType,
  {
    Icon: () => React.JSX.Element;
    borderColor: string;
    iconBg: string;
    label: string;
  }
> = {
  approval: {
    Icon: ApprovalIcon,
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    label: "Aprovação",
  },
  rejection: {
    Icon: RejectionIcon,
    borderColor: "border-l-red-500",
    iconBg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40",
    label: "Rejeição",
  },
  reminder: {
    Icon: ReminderIcon,
    borderColor: "border-l-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
    label: "Lembrete",
  },
  overdue: {
    Icon: OverdueIcon,
    borderColor: "border-l-red-600",
    iconBg: "bg-red-100 dark:bg-red-950/60 border-red-300 dark:border-red-800/60",
    label: "Atraso",
  },
  new_item: {
    Icon: SystemIcon,
    borderColor: "border-l-[var(--color-primary)]",
    iconBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40",
    label: "Comunicado",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<LabNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [markingAll, setMarkingAll] = useState(false);
  const { addToast } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<LabNotification[]>>("/notifications?limit=100");
      setNotifications(res.data ?? []);
    } catch {
      addToast({ title: "Erro", message: "Falha ao carregar notificações", variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "loans":
        return notifications.filter((n) => ["approval", "rejection", "reminder", "overdue"].includes(n.type));
      case "system":
        return notifications.filter((n) => n.type === "new_item");
      case "all":
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  async function markAsRead(id: string) {
    try {
      await api.put(`/notifications/${id}/read`, { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao atualizar", variant: "error" });
    }
  }

  async function markAllAsRead() {
    setMarkingAll(true);
    try {
      await api.put("/notifications/read-all", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast({ title: "Sucesso", message: "Todas as notificações foram marcadas como lidas", variant: "success" });
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao marcar notificações", variant: "error" });
    } finally {
      setMarkingAll(false);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await api.del(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      addToast({ title: "Excluída", message: "Notificação removida com sucesso", variant: "info" });
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao excluir", variant: "error" });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notificações"
        description="Avisos sobre aprovações de empréstimos, prazos de devolução e comunicados do laboratório."
        actions={
          unreadCount > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7m-14 4l4 4L19 7" />
              </svg>
              {markingAll ? "Atualizando..." : "Marcar todas como lidas"}
            </Button>
          ) : undefined
        }
      />

      {/* Tabs de Filtro */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "all"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-[var(--color-bg)] text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Todas
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)]"
            }`}
          >
            {notifications.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "unread"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-[var(--color-bg)] text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Não lidas
          {unreadCount > 0 && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeTab === "unread" ? "bg-white/20 text-white" : "bg-[var(--color-primary)] text-white"
              }`}
            >
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("loans")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "loans"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-[var(--color-bg)] text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Empréstimos & Prazos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("system")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === "system"
              ? "bg-[var(--color-primary)] text-white shadow-sm"
              : "bg-[var(--color-bg)] text-[var(--color-text-subtle)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Avisos do Sistema
        </button>
      </div>

      {/* Lista de Notificações */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]/50"
            />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title={
            activeTab === "unread"
              ? "Nenhuma notificação não lida"
              : activeTab === "loans"
              ? "Nenhum aviso de empréstimo"
              : activeTab === "system"
              ? "Nenhum comunicado do sistema"
              : "Sem notificações"
          }
          description={
            activeTab === "unread"
              ? "Você já leu todas as suas notificações."
              : "Não há avisos nesta categoria no momento."
          }
        />
      ) : (
        <ul className="space-y-3">
          {filteredNotifications.map((n) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.new_item;
            const IconComponent = config.Icon;

            return (
              <li
                key={n.id}
                className={`rounded-2xl border border-[var(--color-border)] border-l-4 ${config.borderColor} p-4 shadow-sm transition-all sm:p-5 ${
                  n.read
                    ? "bg-[var(--color-bg)]"
                    : "bg-blue-50/60 dark:bg-[var(--color-surface-elevated)]"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.iconBg}`}
                    >
                      <IconComponent />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-[var(--color-text)]">{n.title}</h2>
                        {!n.read && (
                          <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-extrabold text-white uppercase tracking-wider">
                            Nova
                          </span>
                        )}
                        <span className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-text-subtle)]">
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-subtle)]">{n.body}</p>
                    </div>
                  </div>

                  <time className="shrink-0 text-xs font-medium text-[var(--color-text-subtle)]" dateTime={n.createdAt}>
                    {formatDate(n.createdAt)}
                  </time>
                </div>

                {/* Ações */}
                <div className="mt-4 flex items-center justify-end gap-2 border-t border-[var(--color-border)]/60 pt-3">
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition-all hover:bg-[var(--color-bg-subtle)] active:scale-95 shadow-sm"
                      title="Marcar como lida"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Marcar como lida
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(n.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-xs font-semibold text-[var(--color-danger)] transition-all hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95"
                    title="Excluir notificação"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
