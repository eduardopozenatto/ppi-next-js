import Image from "next/image";
import Link from "next/link";
import type { LabInventoryList } from "@/types/lab-inventory";
import { cn } from "@/lib/utils";

export interface InventoryCatalogGridProps {
  items: LabInventoryList;
  className?: string;
}

export function InventoryCatalogGrid({ items, className }: InventoryCatalogGridProps) {
  return (
    <section className={cn("grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3", className)}>
      {Object.entries(items).map(([key, item]) => {
        const src = item.image ? (item.image.startsWith("/") ? item.image : `/${item.image}`) : "/buttonIcons/box.svg";
        const available = item.availableQuantity > 0;
        return (
          <article
            key={key}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm transition-shadow hover:shadow-md sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
                    available
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-neutral-100 text-neutral-600 ring-neutral-200"
                  )}
                >
                  {available ? `${item.availableQuantity} disponíveis` : "Indisponível"}
                </span>
                <Link
                  href={`/loans/new?item=${encodeURIComponent(item.id)}`}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors sm:text-sm",
                    available
                      ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                      : "pointer-events-none bg-neutral-300"
                  )}
                  aria-disabled={!available}
                >
                  Solicitar
                </Link>
              </div>
              <div>
                <Link href={`/inventory/${item.id}`} className="group">
                  <h2 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] sm:text-lg">
                    {item.name}
                  </h2>
                </Link>
                <p className="text-sm font-medium text-[var(--color-text-subtle)]">{item.category}</p>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-text)]">{item.description}</p>
            </div>
            <Link
              href={`/inventory/${item.id}`}
              className="relative block h-48 w-full shrink-0 bg-[var(--color-bg-subtle)] sm:h-auto sm:min-h-[11rem] sm:w-40 md:w-44"
            >
              <Image
                src={src}
                alt={`Imagem do item: ${item.name}`}
                fill
                className="object-contain p-3"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 40vw, 280px"
              />
            </Link>
          </article>
        );
      })}
    </section>
  );
}
