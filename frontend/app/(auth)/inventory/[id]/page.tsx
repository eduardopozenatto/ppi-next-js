"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { api } from "@/lib/api/client";
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

  const src = item.image.startsWith("/") ? item.image : `/${item.image}`;

  return (
    <div>
      <PageHeader
        title={item.name}
        description={item.category}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/items"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              ← Catálogo
            </Link>
            <Link
              href={`/cart`}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              Ir para o carrinho
            </Link>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,20rem)]">
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
        </div>
        <div className="relative aspect-square w-full max-w-md justify-self-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] lg:max-w-none">
          <Image src={src} alt={item.name} fill className="object-contain p-6" sizes="(max-width: 1024px) 100vw, 320px" />
        </div>
      </div>
    </div>
  );
}
