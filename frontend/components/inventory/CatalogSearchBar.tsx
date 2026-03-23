"use client";

import { useState } from "react";
import Image from "next/image";
import { CategoryPanel } from "@/components/inventory/CategoryList";
import { Input } from "@/components/Input/Input";
import { cn } from "@/lib/utils";

export function CatalogSearchBar() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <div className="min-w-0 flex-1">
          <Input type="search" placeholder="Buscar por nome ou descrição..." name="q" />
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-sm font-medium text-[var(--color-text)] shadow-sm transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:h-auto sm:min-w-[10.5rem]"
          )}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls="catalog-category-panel"
        >
          <Image src="/filter.svg" alt="" width={16} height={16} className="opacity-70" aria-hidden />
          <span>Todos</span>
          <Image
            src={open ? "/angle-up.svg" : "/angle-down.svg"}
            alt=""
            width={14}
            height={14}
            className="opacity-60"
            aria-hidden
          />
        </button>
      </div>

      {open ? (
        <div
          id="catalog-category-panel"
          className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3 shadow-lg shadow-[var(--color-text)]/10 sm:left-auto sm:right-0 sm:w-56"
          role="region"
          aria-label="Filtrar por categoria"
        >
          <CategoryPanel />
        </div>
      ) : null}
    </section>
  );
}
