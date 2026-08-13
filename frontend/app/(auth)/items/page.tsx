"use client";

import { useEffect, useState } from "react";
import { CatalogSearchBar } from "@/components/inventory/CatalogSearchBar";
import { InventoryCatalogGrid } from "@/components/inventory/InventoryCatalogGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryList, LabInventoryListItem } from "@/types/lab-inventory";

export default function CatalogPage() {
  const [items, setItems] = useState<LabInventoryList>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [categoryName, setCategoryName] = useState("Todos");
  const [showImages, setShowImages] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<LabInventoryListItem[]>>("/inventory");
        const map: LabInventoryList = {};
        for (const item of res.data ?? []) {
          map[String(item.id)] = item;
        }
        setItems(map);
      } catch {
        // silently fail — empty catalog
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEntries = Object.entries(items).filter(([_, item]) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = category === "all" || item.category === categoryName;
    return item.isActive && matchesSearch && matchesCategory;
  });

  const filteredCount = filteredEntries.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Buscar itens"
        description="Encontre equipamentos disponíveis no laboratório e faça seu pedido de empréstimo."
      />

      <CatalogSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={(val, name) => {
          setCategory(val);
          setCategoryName(name);
        }}
        categoryName={categoryName}
      />

      <div className="flex items-center justify-between gap-3 pt-2">
        <p className="text-xs font-semibold text-[var(--color-text-subtle)] sm:text-sm">
          {filteredCount} {filteredCount === 1 ? "equipamento encontrado" : "equipamentos encontrados"}
        </p>

        <button
          type="button"
          onClick={() => setShowImages(!showImages)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] shadow-xs transition-all hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-border-strong)] active:scale-[0.98]"
        >
          {showImages ? "Ocultar fotos" : "Mostrar fotos"}
        </button>
      </div>

      <div>
        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]" />
            ))}
          </div>
        ) : (
          <InventoryCatalogGrid
            items={Object.fromEntries(filteredEntries)}
            showImages={showImages}
          />
        )}
      </div>
    </div>
  );
}
