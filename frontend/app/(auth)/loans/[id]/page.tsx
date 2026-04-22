"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { LoanStatusBadge } from "@/components/loans/LoanStatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/lib/utils";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { Loan } from "@/types/loan";

interface LoanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { id } = use(params);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<Loan>>(`/loans/${id}`);
        setLoan(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-text-subtle)]">Carregando empréstimo...</div>;
  }

  if (error || !loan) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Empréstimo não encontrado</h2>
        <Link href="/loans" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">Voltar para empréstimos</Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Empréstimo · ${loan.borrowerName}`}
        description={loan.borrowerEmail}
        actions={
          <Link
            href="/loans"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            ← Voltar à lista
          </Link>
        }
      />

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <LoanStatusBadge status={loan.status} />
          <span className="text-sm text-[var(--color-text-subtle)]">ID {loan.id}</span>
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
              Início
            </dt>
            <dd className="mt-1 text-[var(--color-text)]">{formatDate(loan.loanDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
              Devolução prevista
            </dt>
            <dd className="mt-1 text-[var(--color-text)]">{formatDate(loan.dueDate)}</dd>
          </div>
          {loan.returnedDate ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
                Devolvido em
              </dt>
              <dd className="mt-1 text-[var(--color-text)]">{formatDate(loan.returnedDate)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Itens</h3>
          <ul className="mt-3 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
            {loan.items.map((item) => (
              <li key={item.inventoryItemId} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-[var(--color-text)]">{item.inventoryItemName}</span>
                <span className="text-[var(--color-text-subtle)]">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        {loan.notes ? (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Notas</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">{loan.notes}</p>
          </div>
        ) : null}
        
        {loan.labObservation ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">Observação do Laboratorista</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">{loan.labObservation}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
