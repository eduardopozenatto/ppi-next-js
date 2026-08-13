"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/Button/Button";
import { api } from "@/lib/api/client";
import { getStaticUrl } from "@/lib/static-url";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/shared/Toast";
import { cn } from "@/lib/utils";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryListItem } from "@/types/lab-inventory";

interface InventoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { id } = use(params);
  const [item, setItem] = useState<LabInventoryListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  const { addItem, totalCount } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<LabInventoryListItem>>(`/inventory/${id}`);
        setItem(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-[var(--color-text-subtle)]">Carregando item...</div>;
  }

  if (error || !item) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Item não encontrado</h2>
        <Link href="/inventory" className="mt-4 inline-block text-[var(--color-primary)] hover:underline">Voltar para o estoque</Link>
      </div>
    );
  }

  const src = getStaticUrl(item.image) || "/buttonIcons/box.svg";

  return (
    <div>
      <PageHeader
        title={item.name}
        description={item.category}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/items"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2 text-sm font-semibold text-[var(--color-text)] transition-all hover:bg-[var(--color-bg-subtle)]"
            >
              ← Voltar ao Catálogo
            </Link>
            <Link
              href="/cart"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] flex items-center gap-2"
            >
              <span>Ir para o carrinho</span>
              {totalCount > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,25rem)_1fr] lg:items-start">
        <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] lg:max-w-none">
          <Image src={src} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 400px" unoptimized />
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Descrição</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">
            {item.description}
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-semibold uppercase text-[var(--color-text-subtle)]">Total</dt>
              <dd className="mt-1 text-lg font-bold text-[var(--color-text)]">{item.quantity}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-[var(--color-text-subtle)]">
                Disponível
              </dt>
              <dd className="mt-1 text-lg font-bold text-[var(--color-text)]">{item.availableQuantity}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-[var(--color-text-subtle)]">
                Emprestados
              </dt>
              <dd className="mt-1 text-lg font-bold text-[var(--color-text)]">{item.loanedQuantity}</dd>
            </div>
          </dl>

          {/* Quantity selector and actions */}
          <div className="mt-8 border-t border-[var(--color-border)] pt-6">
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Quantidade desejada:
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] p-1 bg-[var(--color-bg-subtle)]">
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.max(1, q - 1))}
                  disabled={selectedQty <= 1 || item.availableQuantity <= 0}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg)] text-base font-bold text-[var(--color-text)] shadow-xs transition-colors hover:bg-[var(--color-bg-subtle)] disabled:opacity-40"
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-[var(--color-text)]">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((q) => Math.min(item.availableQuantity, q + 1))}
                  disabled={selectedQty >= item.availableQuantity}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-bg)] text-base font-bold text-[var(--color-text)] shadow-xs transition-colors hover:bg-[var(--color-bg-subtle)] disabled:opacity-40"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              <Button
                type="button"
                variant="secondary"
                disabled={item.availableQuantity <= 0}
                onClick={() => {
                  addItem(
                    {
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      availableQuantity: item.availableQuantity,
                      image: item.image,
                    },
                    selectedQty
                  );
                  addToast({
                    title: "Adicionado ao carrinho",
                    message: `${selectedQty}x ${item.name} foi adicionado ao seu carrinho.`,
                    variant: "success",
                  });
                }}
              >
                + Adicionar ao Carrinho
              </Button>

              <Link
                href={`/loans/new?item=${encodeURIComponent(item.id)}`}
                className={cn(
                  "rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.97]",
                  item.availableQuantity > 0
                    ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                    : "pointer-events-none bg-neutral-300 dark:bg-neutral-700"
                )}
              >
                Solicitar Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
