"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LabInventoryList } from "@/types/lab-inventory";
import { cn } from "@/lib/utils";
import { getStaticUrl } from "@/lib/static-url";

import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/shared/Toast";

export interface InventoryCatalogGridProps {
  items: LabInventoryList;
  className?: string;
  showImages?: boolean;
}

export function InventoryCatalogGrid({
  items,
  className,
  showImages = true,
}: InventoryCatalogGridProps) {
  const { addItem } = useCart();
  const { addToast } = useToast();
  // Estado local para controle individual de exibição de foto por item (ID -> boolean)
  const [expandedImages, setExpandedImages] = useState<Record<string, boolean>>({});

  function toggleSingleImage(id: string) {
    setExpandedImages((prev) => {
      const current = prev[id] ?? showImages;
      return { ...prev, [id]: !current };
    });
  }

  return (
    <section className={cn("grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {Object.entries(items).map(([key, item]) => {
        const src = getStaticUrl(item.image) || "/buttonIcons/box.svg";
        const available = item.availableQuantity > 0;
        const isImageVisible = expandedImages[item.id] ?? showImages;

        return (
          <article
            key={key}
            className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--color-border-strong)] sm:flex-row"
          >
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3.5 sm:p-4">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-all duration-200",
                      available
                        ? "bg-[var(--color-bg-subtle)] text-[var(--color-success)] border-[var(--color-border-strong)]"
                        : "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)] border-[var(--color-border)] opacity-70"
                    )}
                  >
                    {available ? `${item.availableQuantity} disp.` : "Indisponível"}
                  </span>
                  <p className="text-xs font-semibold text-[var(--color-text-subtle)]">{item.category}</p>
                </div>

                <div>
                  <Link href={`/inventory/${item.id}`} className="group">
                    <h2 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] sm:text-base">
                      {item.name}
                    </h2>
                  </Link>
                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-subtle)] line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[var(--color-border)]/60 pt-2.5">
                <button
                  type="button"
                  onClick={() => toggleSingleImage(item.id)}
                  className="text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-primary)] underline underline-offset-2"
                >
                  {isImageVisible ? "Ocultar foto" : "Ver foto"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      if (!available) return;
                      addItem(
                        {
                          id: item.id,
                          name: item.name,
                          category: item.category,
                          availableQuantity: item.availableQuantity,
                          image: item.image,
                        },
                        1
                      );
                      addToast({
                        title: "Adicionado ao carrinho",
                        message: `1x ${item.name} foi adicionado ao seu carrinho.`,
                        variant: "success",
                      });
                    }}
                    className={cn(
                      "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-bg-subtle)] active:scale-[0.97]",
                      !available && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    + Carrinho
                  </button>

                  <Link
                    href={`/loans/new?item=${encodeURIComponent(item.id)}`}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.97]",
                      available
                        ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]"
                        : "pointer-events-none bg-neutral-300 dark:bg-neutral-700"
                    )}
                    aria-disabled={!available}
                  >
                    Solicitar
                  </Link>
                </div>
              </div>
            </div>

            {isImageVisible && (
              <Link
                href={`/inventory/${item.id}`}
                className="block shrink-0 bg-[var(--color-bg-subtle)] sm:w-32 md:w-36 transition-all duration-200"
              >
                <Image
                  src={src}
                  alt={`Imagem do item: ${item.name}`}
                  width={300}
                  height={300}
                  className="h-36 w-full object-cover sm:h-full"
                  unoptimized
                />
              </Link>
            )}
          </article>
        );
      })}
    </section>
  );
}
