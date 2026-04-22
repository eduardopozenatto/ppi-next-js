"use client";

import { useEffect, useState } from "react";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/Button/Button";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { Loan } from "@/types/loan";

export default function ApprovalsPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [approveModal, setApproveModal] = useState<Loan | null>(null);
  const [rejectModal, setRejectModal] = useState<Loan | null>(null);
  const [detailModal, setDetailModal] = useState<Loan | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [observation, setObservation] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [dueDateError, setDueDateError] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  const pending = loans.filter((l) => l.status === "pending");
  const approved = loans.filter((l) => l.status === "active" || l.status === "overdue");
  const rejected = loans.filter((l) => l.status === "cancelled");

  async function fetchLoans() {
    try {
      const res = await api.get<ApiResponse<Loan[]>>("/loans");
      setLoans(res.data ?? []);
    } catch {
      addToast({ title: "Erro", message: "Falha ao carregar empréstimos", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchLoans(); }, []);

  async function handleApprove() {
    if (!dueDate) { setDueDateError(true); return; }
    const d = new Date(dueDate);
    if (d <= new Date()) { setDueDateError(true); return; }
    if (!approveModal) return;
    try {
      await api.put(`/loans/${approveModal.id}/status`, {
        status: "active",
        dueDate: d.toISOString(),
        observation: observation || undefined,
      });
      addToast({ title: "Aprovado", message: "Empréstimo aprovado com sucesso", variant: "success" });
      setApproveModal(null);
      setDueDate("");
      setObservation("");
      await fetchLoans();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao aprovar", variant: "error" });
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) { setReasonError(true); return; }
    if (!rejectModal) return;
    try {
      await api.put(`/loans/${rejectModal.id}/status`, {
        status: "cancelled",
        observation: rejectReason,
      });
      addToast({ title: "Rejeitado", message: "Empréstimo rejeitado", variant: "info" });
      setRejectModal(null);
      setRejectReason("");
      await fetchLoans();
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao rejeitar", variant: "error" });
    }
  }

  return (
    <div>
      <PageHeader
        title="Aprovações"
        description="Pedidos de empréstimo aguardando decisão do laboratório."
      />

      {/* Counter Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Pendentes</p>
          <p className="mt-1 text-3xl font-bold text-yellow-800 dark:text-yellow-300">{pending.length}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">Aprovados</p>
          <p className="mt-1 text-3xl font-bold text-green-800 dark:text-green-300">{approved.length}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">Rejeitados</p>
          <p className="mt-1 text-3xl font-bold text-red-800 dark:text-red-300">{rejected.length}</p>
        </div>
      </div>

      {/* Pending List */}
      {pending.length === 0 ? (
        <EmptyState
          title="Nenhum empréstimo encontrado"
          description="Nenhum usuário solicitou empréstimo até o momento."
        />
      ) : (
        <ul className="space-y-4">
          {pending.map((loan) => (
            <li key={loan.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-[var(--color-text)]">
                      {loan.items.map((i) => i.inventoryItemName).join(", ")}
                    </h2>
                    <LoanStatusBadge status={loan.status} />
                    <span className="rounded-full bg-[var(--color-bg-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-subtle)]">
                      Qtd: {loan.items.reduce((a, i) => a + i.quantity, 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
                    👤 {loan.borrowerName} · 📅 {formatDate(loan.loanDate)}
                  </p>

                  {/* Student message */}
                  {loan.notes && (
                    <div className="mt-3 rounded-lg border-l-4 border-l-[var(--color-primary)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text)]">
                      {loan.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  <button type="button" onClick={() => setDetailModal(loan)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg-subtle)]" title="Ver detalhes">
                    👁 Detalhes
                  </button>
                  <button type="button" onClick={() => setRejectModal(loan)} className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-red-50" title="Rejeitar">
                    ✕ Rejeitar
                  </button>
                  <button type="button" onClick={() => { setApproveModal(loan); setDueDateError(false); }} className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]" title="Aprovar">
                    ✓ Aprovar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Detalhes do empréstimo</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-[var(--color-text-subtle)]">Item</dt> <dd className="font-medium text-[var(--color-text)]">{detailModal.items.map((i) => i.inventoryItemName).join(", ")}</dd></div>
              <div><dt className="text-[var(--color-text-subtle)]">Solicitante</dt> <dd className="font-medium text-[var(--color-text)]">{detailModal.borrowerName}</dd></div>
              <div><dt className="text-[var(--color-text-subtle)]">Quantidade</dt> <dd className="font-medium text-[var(--color-text)]">{detailModal.items.reduce((a, i) => a + i.quantity, 0)}</dd></div>
              <div><dt className="text-[var(--color-text-subtle)]">Data da solicitação</dt> <dd className="font-medium text-[var(--color-text)]">{formatDate(detailModal.createdAt)}</dd></div>
              {detailModal.notes && <div><dt className="text-[var(--color-text-subtle)]">Mensagem do aluno</dt><dd className="mt-1 rounded-lg border-l-4 border-l-[var(--color-primary)] bg-[var(--color-bg-subtle)] p-3 text-[var(--color-text)]">{detailModal.notes}</dd></div>}
            </dl>
            <div className="mt-6 flex justify-end">
              <Button type="button" variant="secondary" onClick={() => setDetailModal(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setApproveModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Aprovar empréstimo</h2>
            <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-[var(--color-text)] dark:bg-blue-900/20">
              <strong>{approveModal.items.map((i) => `${i.inventoryItemName} × ${i.quantity}`).join(", ")}</strong>
              <span className="text-[var(--color-text-subtle)]"> — {approveModal.borrowerName}</span>
            </div>
            {approveModal.notes && (
              <div className="mt-3 rounded-lg border-l-4 border-l-[var(--color-primary)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text)]">
                {approveModal.notes}
              </div>
            )}
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="approve-date" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Data de devolução *</label>
                <input id="approve-date" type="date" value={dueDate} onChange={(e) => { setDueDate(e.target.value); setDueDateError(false); }}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${dueDateError ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"}`}
                />
                {dueDateError && <p className="mt-1 text-xs text-[var(--color-danger)]">Informe uma data futura válida</p>}
              </div>
              <div>
                <label htmlFor="approve-obs" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Observação (opcional)</label>
                <textarea id="approve-obs" rows={2} value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Mensagem para o aluno..."
                  className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setApproveModal(null)}>Cancelar</Button>
              <Button type="button" onClick={handleApprove}>Aprovar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setRejectModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Rejeitar empréstimo</h2>
            {rejectModal.notes && (
              <div className="mt-3 rounded-lg border-l-4 border-l-[var(--color-primary)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text)]">
                <p className="text-xs font-semibold text-[var(--color-text-subtle)]">Mensagem do aluno:</p>
                {rejectModal.notes}
              </div>
            )}
            <div className="mt-4">
              <label htmlFor="reject-reason" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Motivo da rejeição *</label>
              <textarea id="reject-reason" rows={3} value={rejectReason} onChange={(e) => { setRejectReason(e.target.value); setReasonError(false); }}
                placeholder="Ex: Período muito longo, item em manutenção..."
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 ${reasonError ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]" : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"}`}
              />
              {reasonError && <p className="mt-1 text-xs text-[var(--color-danger)]">Informe o motivo da rejeição</p>}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setRejectModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleReject} className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
