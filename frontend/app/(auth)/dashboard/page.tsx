"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Loan } from "@/types/loan";

interface DashboardStats {
  activeLoans: number;
  pendingLoans: number;
  totalAvailable: number;
  unreadNotifications: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [loansRes, inventoryRes, notifRes] = await Promise.all([
          api.get<ApiResponse<Loan[]>>("/loans"),
          api.get<ApiResponse<{ totalAvailable: number }>>("/reports/inventory"),
          api.get<ApiResponse<{ unread: number }>>("/notifications?unread_count=true"),
        ]);

        const loans = loansRes.data ?? [];
        const activeLoans = loans.filter((l) => l.status === "active").length;
        const pendingLoans = loans.filter((l) => l.status === "pending").length;

        setStats({
          activeLoans,
          pendingLoans,
          totalAvailable: inventoryRes.data?.totalAvailable ?? 0,
          unreadNotifications: notifRes.data?.unread ?? 0,
        });
        setRecentLoans(loans.slice(0, 4));
      } catch {
        // Silently fail — stats will remain null (show loading/empty)
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader title="Painel" description="Resumo do laboratório — estoque, empréstimos e alertas." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Empréstimos ativos", value: String(stats?.activeLoans ?? 0), href: "/loans" },
    { label: "Pedidos pendentes", value: String(stats?.pendingLoans ?? 0), href: "/approvals" },
    { label: "Itens disponíveis", value: String(stats?.totalAvailable ?? 0), href: "/items" },
    { label: "Notificações novas", value: String(stats?.unreadNotifications ?? 0), href: "/notifications" },
  ];

  return (
    <div>
      <PageHeader
        title="Painel"
        description="Resumo do laboratório — estoque, empréstimos e alertas."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-[var(--color-text-subtle)]">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text)]">{s.value}</p>
            <span className="mt-3 inline-flex text-sm font-semibold text-[var(--color-primary)]">
              Ver detalhes →
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Empréstimos recentes</h2>
          <Link href="/loans" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Ver todos
          </Link>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">
          {recentLoans.map((loan) => (
            <li key={loan.id} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[var(--color-text)]">{loan.borrowerName}</p>
                <p className="text-sm text-[var(--color-text-subtle)]">
                  {loan.items.map((i) => i.inventoryItemName).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-subtle)]">
                  Devolução {formatDate(loan.dueDate)}
                </span>
                <Link
                  href={`/loans/${loan.id}`}
                  className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Abrir
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
