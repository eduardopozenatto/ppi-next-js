"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/Button/Button";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import Link from "next/link";

/** Cart line — kept in local state (client-side only). */
export interface CartLine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
}

export default function CartPage() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const totalItems = lines.length;
  const totalUnits = lines.reduce((acc, l) => acc + l.quantity, 0);

  function updateQty(id: string, delta: number) {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const next = Math.max(1, Math.min(l.availableQuantity, l.quantity + delta));
        return { ...l, quantity: next };
      })
    );
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleConfirm() {
    if (!message.trim()) {
      setMessageError(true);
      return;
    }
    setMessageError(false);
    try {
      await api.post("/loans", {
        items: lines.map((l) => ({
          inventoryItemId: Number(l.id),
          quantity: l.quantity,
        })),
        notes: message,
      });
      setShowModal(false);
      setMessage("");
      setLines([]);
      setSubmitted(true);
      addToast({ title: "Sucesso", message: "Empréstimo criado com sucesso", variant: "success" });
    } catch (err) {
      addToast({ title: "Erro", message: err instanceof Error ? err.message : "Falha ao criar empréstimo", variant: "error" });
    }
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Carrinho" description="Itens selecionados antes de confirmar o pedido de empréstimo." />
        <EmptyState
          title="Empréstimo criado com sucesso!"
          description="Seu empréstimo foi enviado ao professor responsável. Aguarde até que seja analisado."
          action={
            <Link
              href="/items"
              className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              Continuar buscando
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Carrinho" description="Itens selecionados antes de confirmar o pedido de empréstimo." />

      {lines.length === 0 ? (
        <EmptyState
          title="Seu carrinho está vazio"
          description="Adicione itens na página de busca para solicitar empréstimo."
          action={
            <Link
              href="/items"
              className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              Ir para catálogo
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Items List */}
          <div className="min-w-0 flex-1">
            <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-bg-subtle)] text-lg">
                    📦
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--color-text)]">{line.name}</p>
                    <p className="text-xs text-[var(--color-text-subtle)]">{line.category}</p>
                    <p className="text-xs text-[var(--color-text-subtle)]">
                      Disponível: {line.availableQuantity} unidades
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, -1)}
                      disabled={line.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm font-bold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-[var(--color-text)]">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, 1)}
                      disabled={line.quantity >= line.availableQuantity}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm font-bold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="rounded p-1.5 text-[var(--color-danger)] transition-colors hover:bg-red-50"
                    title="Remover do carrinho"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary Panel */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm">
              <h3 className="font-semibold text-[var(--color-text)]">Resumo</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-subtle)]">Itens distintos</dt>
                  <dd className="font-medium text-[var(--color-text)]">{totalItems}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-subtle)]">Total de unidades</dt>
                  <dd className="font-medium text-[var(--color-text)]">{totalUnits}</dd>
                </div>
              </dl>
              <Button type="button" className="mt-6 w-full" onClick={() => setShowModal(true)}>
                Solicitar empréstimo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div
            className="w-full max-w-lg rounded-2xl bg-[var(--color-bg)] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar solicitação"
          >
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Confirmar solicitação</h2>
            <p className="mt-1 text-sm text-[var(--color-text-subtle)]">
              Revise os itens e escreva uma mensagem para o laboratorista.
            </p>

            <ul className="mt-4 space-y-1 text-sm text-[var(--color-text)]">
              {lines.map((l) => (
                <li key={l.id}>
                  {l.name} <span className="text-[var(--color-text-subtle)]">× {l.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <label htmlFor="cart-message" className="mb-1 block text-sm font-medium text-[var(--color-text)]">
                Mensagem para o laboratorista *
              </label>
              <textarea
                id="cart-message"
                rows={3}
                placeholder="Explique o motivo do empréstimo e sugira uma data de devolução desejada..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageError(false);
                }}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-subtle)] focus:outline-none focus:ring-1 ${
                  messageError
                    ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
                    : "border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                }`}
              />
              {messageError && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">Preencha os campos com *</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleConfirm}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
