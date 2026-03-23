"use client";

import { useState } from "react";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/Button/Button";
import { formatDate } from "@/lib/utils";
import { MOCK_LOANS } from "@/mocks/loans";
import type { Loan } from "@/types/loan";

// TODO: substituir por chamada real quando backend estiver pronto

type Tab = "active" | "history";

const ACTIVE_STATUSES = ["active", "pending", "overdue"];
const HISTORY_STATUSES = ["returned", "cancelled"];

export default function LoansListPage() {
  const [tab, setTab] = useState<Tab>("active");
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [editModal, setEditModal] = useState<Loan | null>(null);
  const [cancelModal, setCancelModal] = useState<Loan | null>(null);
  const [editMessage, setEditMessage] = useState("");

  const activeLoans = loans.filter((l) => ACTIVE_STATUSES.includes(l.status));
  const historyLoans = loans.filter((l) => HISTORY_STATUSES.includes(l.status));
  const currentLoans = tab === "active" ? activeLoans : historyLoans;

  function handleEdit(loan: Loan) {
    setEditMessage(loan.notes ?? "");
    setEditModal(loan);
  }

  function handleSaveEdit() {
    if (!editModal) return;
    setLoans((prev) => prev.map((l) => (l.id === editModal.id ? { ...l, notes: editMessage } : l)));
    setEditModal(null);
  }

  function handleCancel() {
    if (!cancelModal) return;
    setLoans((prev) => prev.map((l) => (l.id === cancelModal.id ? { ...l, status: "cancelled" as const } : l)));
    setCancelModal(null);
  }

  return (
    <div>
      <PageHeader
        title="Meus Empréstimos"
        description="Acompanhe seus empréstimos ativos e consulte o histórico."
      />

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-[var(--color-bg-subtle)] p-1">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "active"
              ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Ativos ({activeLoans.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("history")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            tab === "history"
              ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]"
          }`}
        >
          Histórico ({historyLoans.length})
        </button>
      </div>

      {/* Loan List */}
      {currentLoans.length === 0 ? (
        <EmptyState
          title="Nenhum empréstimo encontrado"
          description={tab === "active" ? "Você não possui empréstimos ativos." : "Nenhum empréstimo no histórico."}
        />
      ) : (
        <div className="space-y-4">
          {currentLoans.map((loan) => (
            <article
              key={loan.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-[var(--color-text)]">
                  {loan.items.map((i) => `${i.inventoryItemName} × ${i.quantity}`).join(", ")}
                </h2>
                <LoanStatusBadge status={loan.status} />
                {loan.returnedLate && loan.status === "returned" && (
                  <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
                    Com atraso
                  </span>
                )}
              </div>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {loan.loanDate && (
                  <p className="text-[var(--color-text-subtle)]">
                    <span className="font-medium text-[var(--color-text)]">Empréstimo:</span> {formatDate(loan.loanDate)}
                  </p>
                )}
                {loan.dueDate && (
                  <p className="text-[var(--color-text-subtle)]">
                    <span className="font-medium text-[var(--color-text)]">Devolução:</span> {formatDate(loan.dueDate)}
                  </p>
                )}
                {loan.returnedDate && (
                  <p className={loan.returnedLate ? "text-yellow-600" : "text-[var(--color-success)]"}>
                    <span className="font-medium">Devolvido em:</span> {formatDate(loan.returnedDate)}
                  </p>
                )}
              </div>

              {/* Student message */}
              {loan.notes && (
                <div className="mt-3 rounded-lg border-l-4 border-l-[var(--color-primary)] bg-[var(--color-bg-subtle)] p-3 text-sm text-[var(--color-text)]">
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)]">Mensagem do aluno:</p>
                  {loan.notes}
                </div>
              )}

              {/* Lab observation */}
              {loan.labObservation && (
                <div className="mt-2 rounded-lg border-l-4 border-l-[var(--color-success)] bg-emerald-50 p-3 text-sm text-[var(--color-text)] dark:bg-emerald-900/20">
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)]">Observação do laboratorista:</p>
                  {loan.labObservation}
                </div>
              )}

              {/* Overdue alert */}
              {loan.status === "overdue" && (
                <div className="mt-2 rounded-lg border-l-4 border-l-[var(--color-danger)] bg-red-50 p-3 text-sm text-[var(--color-danger)] dark:bg-red-900/20">
                  ⚠️ Este item está com a devolução atrasada. Regularize a situação o mais rápido possível.
                </div>
              )}

              {/* Actions for Pending status */}
              {loan.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="secondary" onClick={() => handleEdit(loan)}>
                    ✎ Editar
                  </Button>
                  <button
                    type="button"
                    onClick={() => setCancelModal(loan)}
                    className="rounded-xl border border-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-[var(--color-danger)] transition-colors hover:bg-red-50"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditModal(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Editar empréstimo</h2>
            <ul className="mt-3 space-y-1 text-sm text-[var(--color-text-subtle)]">
              {editModal.items.map((i) => (<li key={i.inventoryItemId}>{i.inventoryItemName} × {i.quantity}</li>))}
            </ul>
            <div className="mt-4">
              <label htmlFor="edit-msg" className="mb-1 block text-sm font-medium text-[var(--color-text)]">Mensagem para o laboratorista</label>
              <textarea id="edit-msg" rows={3} value={editMessage} onChange={(e) => setEditMessage(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Button>
              <Button type="button" onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setCancelModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Cancelar empréstimo</h2>
            <p className="mt-2 text-sm text-[var(--color-text-subtle)]">Deseja cancelar o empréstimo? Você poderá criar outro depois.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setCancelModal(null)}>Cancelar</Button>
              <button type="button" onClick={handleCancel}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                Cancelar empréstimo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
