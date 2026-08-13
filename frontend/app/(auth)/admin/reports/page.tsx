"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { formatDate } from "@/lib/utils";
import { api, BASE_URL } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { Loan } from "@/types/loan";

type Tab = "estoque" | "emprestimos";
type Period = "7" | "30" | "90" | "all";

interface InventoryReport {
  summary: { totalItems: number; availableQuantity: number; totalUsers: number; activeUsers: number };
  itemsByCategory: Array<{ categoryName: string; totalItems: number; totalQuantity: number; availableQuantity: number }>;
  mostBorrowed: Array<{ itemName: string; borrowedQuantity: number }>;
}

interface LoansReport {
  summary: { totalLoans: number; activeLoans: number; overdueLoans: number; returnedLoans: number; pendingLoans: number };
}

export default function AdminReportsPage() {
  const [tab, setTab] = useState<Tab>("estoque");
  const [period, setPeriod] = useState<Period>("30");

  const [invReport, setInvReport] = useState<InventoryReport | null>(null);
  const [loansReport, setLoansReport] = useState<LoansReport | null>(null);
  const [loansTable, setLoansTable] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [invRes, loansRepRes, loansRes] = await Promise.all([
          api.get<ApiResponse<InventoryReport>>("/reports/inventory"),
          api.get<ApiResponse<LoansReport>>(`/reports/loans?period=${period}`),
          api.get<ApiResponse<Loan[]>>("/loans"),
        ]);
        setInvReport(invRes.data);
        setLoansReport(loansRepRes.data);
        setLoansTable(loansRes.data ?? []);
      } catch (err) {
        addToast({ title: "Erro", message: "Falha ao carregar relatórios", variant: "error" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period, addToast]);

  async function handleExport() {
    setExporting(true);
    try {
      const endpoint = tab === "estoque"
        ? "/reports/export/inventory"
        : `/reports/export/loans?period=${period}`;

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Falha ao exportar");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = tab === "estoque"
        ? `estoque-${new Date().toISOString().split("T")[0]}.xlsx`
        : `emprestimos-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      addToast({ title: "Exportado", message: "Relatório baixado com sucesso!", variant: "success" });
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao exportar", variant: "error" });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Indicadores e métricas para gestão do laboratório."
        actions={
          <Button type="button" variant="secondary" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exportando..." : "Exportar"}
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border-strong)]">
          <p className="text-sm font-medium text-[var(--color-text-subtle)]">Total de itens</p>
          <p className="mt-1.5 text-3xl font-bold text-[var(--color-text)]">
            {loading ? "..." : invReport?.summary.totalItems ?? 0}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-[var(--color-primary)]">
            {loading ? "..." : invReport?.summary.availableQuantity ?? 0} disponíveis
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border-strong)]">
          <p className="text-sm font-medium text-[var(--color-text-subtle)]">Empréstimos</p>
          <p className="mt-1.5 text-3xl font-bold text-[var(--color-text)]">
            {loading ? "..." : loansReport?.summary.totalLoans ?? 0}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-[var(--color-success)]">
            {loading ? "..." : loansReport?.summary.activeLoans ?? 0} ativos
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border-strong)]">
          <p className="text-sm font-medium text-[var(--color-text-subtle)]">Atrasados</p>
          <p className="mt-1.5 text-3xl font-bold text-[var(--color-text)]">
            {loading ? "..." : loansReport?.summary.overdueLoans ?? 0}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-[var(--color-danger)]">Requerem atenção</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border-strong)]">
          <p className="text-sm font-medium text-[var(--color-text-subtle)]">Usuários</p>
          <p className="mt-1.5 text-3xl font-bold text-[var(--color-text)]">
            {loading ? "..." : invReport?.summary.totalUsers ?? 0}
          </p>
          <p className="mt-1.5 text-xs font-semibold text-[var(--color-warning)]">
            {loading ? "..." : invReport?.summary.activeUsers ?? 0} ativos
          </p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-[var(--color-text-subtle)]">Período:</span>
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
                  <th className="px-5 py-3">Total (unidades)</th>
                  <th className="px-5 py-3">Disponível</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {invReport?.itemsByCategory.map((row) => (
                  <tr key={row.categoryName} className="hover:bg-[var(--color-bg-subtle)]/50">
                    <td className="px-5 py-3 font-medium text-[var(--color-text)]">{row.categoryName}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.totalQuantity}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.availableQuantity}</td>
                  </tr>
                ))}
                {!invReport?.itemsByCategory.length && !loading && (
                  <tr>
                    <td colSpan={3} className="px-5 py-4 text-center text-[var(--color-text-subtle)]">Sem dados de estoque.</td>
                  </tr>
                )}
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
                  <th className="px-5 py-3">Quantidade total emprestada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {invReport?.mostBorrowed.map((row) => (
                  <tr key={row.itemName} className="hover:bg-[var(--color-bg-subtle)]/50">
                    <td className="px-5 py-3 font-medium text-[var(--color-text)]">{row.itemName}</td>
                    <td className="px-5 py-3 text-[var(--color-text-subtle)]">{row.borrowedQuantity}×</td>
                  </tr>
                ))}
                {!invReport?.mostBorrowed.length && !loading && (
                  <tr>
                    <td colSpan={2} className="px-5 py-4 text-center text-[var(--color-text-subtle)]">Sem dados de empréstimos.</td>
                  </tr>
                )}
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
              {loansTable.map((loan) => (
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
              {!loansTable.length && !loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-4 text-center text-[var(--color-text-subtle)]">Sem dados de empréstimos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
