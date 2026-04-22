"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/Button/Button";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { LabNotification, NotificationType } from "@/types/notification";

const TYPE_CONFIG: Record<NotificationType, { icon: string; borderColor: string }> = {
  approval: { icon: "✅", borderColor: "border-l-[var(--color-success)]" },
  reminder: { icon: "⚠️", borderColor: "border-l-yellow-400" },
  rejection: { icon: "❌", borderColor: "border-l-[var(--color-danger)]" },
  new_item: { icon: "ℹ️", borderColor: "border-l-[var(--color-primary)]" },
  overdue: { icon: "🔴", borderColor: "border-l-[var(--color-danger)]" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<LabNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  async function fetchNotifications() {
    try {
      const res = await api.get<ApiResponse<LabNotification[]>>("/notifications");
      setNotifications(res.data ?? []);
    } catch {
      addToast({ title: "Erro", message: "Falha ao carregar notificações", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchNotifications(); }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha", variant: "error" });
    }
  }

  async function markAllAsRead() {
    try {
      // Mark each unread notification — backend may support bulk endpoint
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(unread.map((n) => api.put(`/notifications/${n.id}/read`)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha", variant: "error" });
    }
  }

  function deleteNotification(id: string) {
    // Remove locally — backend doesn't have a delete endpoint for notifications
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div>
      <PageHeader
        title="Notificações"
        description="Alertas sobre empréstimos, prazos e avisos do laboratório."
        actions={
          unreadCount > 0 ? (
            <Button type="button" variant="secondary" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="Sem notificações"
          description="Você não possui notificações no momento."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const config = TYPE_CONFIG[n.type];
            return (
              <li
                key={n.id}
                className={`rounded-2xl border border-[var(--color-border)] border-l-4 ${config.borderColor} p-4 shadow-sm transition-all sm:p-5 ${
                  n.read
                    ? "bg-[var(--color-bg)]"
                    : "bg-azure-50/80 dark:bg-[var(--color-bg-subtle)]"
                }`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">{config.icon}</span>
                    <h2 className="font-semibold text-[var(--color-text)]">{n.title}</h2>
                    {!n.read && (
                      <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold text-white">
                        Nova
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-[var(--color-text-subtle)]" dateTime={n.createdAt}>
                    {formatDate(n.createdAt)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">{n.body}</p>

                <div className="mt-3 flex gap-2">
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]"
                      title="Marcar como lida"
                    >
                      ✓ Marcar como lida
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(n.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-red-50"
                    title="Excluir notificação"
                  >
                    🗑 Excluir
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
