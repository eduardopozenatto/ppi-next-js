"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { formatDate } from "@/lib/utils";
import { MOCK_INVENTORY_ITEMS } from "@/mocks/inventory-items";
import { MOCK_LOANS } from "@/mocks/loans";
import { MOCK_ADMIN_USERS } from "@/mocks/users";

// TODO: substituir por chamada real quando backend estiver pronto

type Tab = "estoque" | "emprestimos";
type Period = "7" | "30" | "90" | "all";

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>("estoque");
  const [period, setPeriod] = useState<Period>("30");

  const inv = Object.values(MOCK_INVENTORY_ITEMS);
  const totalItems = inv.length;
  const availableItems = inv.reduce((a, i) => a + i.availableQuantity, 0);
  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active" || l.status === "pending").length;
  const overdueLoans = MOCK_LOANS.filter((l) => l.status === "overdue").length;
  const activeUsers = MOCK_ADMIN_USERS.filter((u) => u.isActive).length;

  // Group items by category for Estoque tab
  const itemsByCategory = inv.reduce<Record<string, { category: string; total: number; available: number }>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = { category: cat, total: 0, available: 0 };
    acc[cat].total += item.quantity;
    acc[cat].available += item.availableQuantity;
    return acc;
  }, {});

  // Most borrowed items (mock count by loan references)
  const borrowedCount = MOCK_LOANS.flatMap((l) => l.items).reduce<Record<string, { name: string; count: number }>>((acc, item) => {
    if (!acc[item.inventoryItemId]) acc[item.inventoryItemId] = { name: item.inventoryItemName, count: 0 };
    acc[item.inventoryItemId].count += item.quantity;
    return acc;
  }, {});
  const mostBorrowed = Object.values(borrowedCount).sort((a, b) => b.count - a.count);

  function handleExport() {
    // TODO: implementar download real CSV/XLSX
    alert(`Exportando dados da aba "${tab === "estoque" ? "Estoque" : "Empréstimos"}"...`);
  }

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Indicadores e métricas para gestão do laboratório."
        actions={
          <Button type="button" variant="secondary" onClick={handleExport}>
            Exportar
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Total de itens</p>
          <p className="mt-1 text-3xl font-bold text-blue-800 dark:text-blue-300">{totalItems}</p>
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">{availableItems} disponíveis</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Empréstimos</p>
          <p className="mt-1 text-3xl font-bold text-green-800 dark:text-green-300">{MOCK_LOANS.length}</p>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">{activeLoans} ativos</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">Atrasados</p>
          <p className="mt-1 text-3xl font-bold text-red-800 dark:text-red-300">{overdueLoans}</p>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">Requerem atenção</p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Usuários</p>
          <p className="mt-1 text-3xl font-bold text-yellow-800 dark:text-yellow-300">{MOCK_ADMIN_USERS.length}</p>
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">{activeUsers} ativos</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-subtle)]">📅 Período:</span>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="all">Todo o período</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[var(--color-bg-subtle)] p-1">
        <button type="button" onClick={() => setTab("estoque")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === "estoque" ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm" : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"}`}
        >
          Estoque
        </button>
        <button type="button" onClick={() => setTab("emprestimos")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === "emprestimos" ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm" : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"}`}
        >
          Empréstimos
        </button>
      </div>

      {/* Estoque Tab */}
      {tab === "estoque" && (
        <div className="space-y-6">
          {/* Items by category */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
            <h3 className="border-b border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-text)]">Itens por categoria</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase text-[var(--color-text-subtle)]">
                <tr>
                  <th className="px-5 py-3">Categoria</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Disponível</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {Object.values(itemsByCategory).map((row) => (
                  <tr key={row.category} className="hover:bg-[var(--color-bg-subtle)]/50">
                    <td className="px-5 py-3 font-medium text-[var(--color-text)]">{row.category}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.total}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Most borrowed */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
            <h3 className="border-b border-[var(--color-border)] px-5 py-3 font-semibold text-[var(--color-text)]">Itens mais emprestados</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase text-[var(--color-text-subtle)]">
                <tr>
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Emprestado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {mostBorrowed.map((row) => (
                  <tr key={row.name} className="hover:bg-[var(--color-bg-subtle)]/50">
                    <td className="px-5 py-3 font-medium text-[var(--color-text)]">{row.name}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.count}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empréstimos Tab */}
      {tab === "emprestimos" && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase text-[var(--color-text-subtle)]">
              <tr>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Usuário</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Devolução</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MOCK_LOANS.map((loan) => (
                <tr key={loan.id} className="hover:bg-[var(--color-bg-subtle)]/50">
                  <td className="px-5 py-3 font-medium text-[var(--color-text)]">{loan.items.map((i) => i.inventoryItemName).join(", ")}</td>
                  <td className="px-5 py-3 text-[var(--color-text-subtle)]">{loan.borrowerName}</td>
                  <td className="px-5 py-3 text-[var(--color-text-subtle)]">{formatDate(loan.loanDate)}</td>
                  <td className="px-5 py-3 text-[var(--color-text-subtle)]">
                    {loan.returnedDate ? formatDate(loan.returnedDate) : loan.status === "pending" || loan.status === "cancelled" ? "Não atribuído" : formatDate(loan.dueDate)}
                  </td>
                  <td className="px-5 py-3"><LoanStatusBadge status={loan.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
