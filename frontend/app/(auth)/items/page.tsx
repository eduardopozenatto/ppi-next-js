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

  return (
    <div>
      <PageHeader
        title="Buscar itens"
        description="Encontre equipamento disponível e solicite empréstimo para o laboratório."
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
      <div className="mt-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)]" />
            ))}
          </div>
        ) : (
          <InventoryCatalogGrid
            items={Object.fromEntries(
              Object.entries(items).filter(([_, item]) => {
                const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesCategory = category === "all" || item.category === categoryName;
                // Ocultar itens inativos do catálogo
                return item.isActive && matchesSearch && matchesCategory;
              })
            )}
          />
        )}
      </div>
    </div>
  );
}
