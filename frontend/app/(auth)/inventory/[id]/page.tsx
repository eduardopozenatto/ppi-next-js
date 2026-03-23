import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { getMockInventoryItem } from "@/mocks/inventory-items";

interface InventoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { id } = await params;
  const item = getMockInventoryItem(id);
  if (!item) notFound();

  const src = item.image.startsWith("/") ? item.image : `/${item.image}`;

  return (
    <div>
      <PageHeader
        title={item.name}
        description={item.category}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/inventory"
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              ← Estoque
            </Link>
            <Link
              href={`/loans/new?item=${encodeURIComponent(item.id)}`}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
            >
              Solicitar empréstimo
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
