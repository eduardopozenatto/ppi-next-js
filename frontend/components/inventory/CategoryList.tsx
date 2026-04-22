"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";

interface Category {
  id: string;
  name: string;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<Category[]>>("/categories");
        setCategories(res.data ?? []);
      } catch {
        // silently fail
      }
    }
    load();
  }, []);

  return (
    <ul className="flex w-full flex-col gap-0.5 py-1">
      {categories.map((category) => (
        <li key={category.id}>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-center text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)]"
          >
            {category.name}
          </button>
        </li>
      ))}
      {categories.length === 0 && (
         <li className="px-3 py-2 text-center text-xs text-[var(--color-text-subtle)]">Nenhuma categoria</li>
      )}
    </ul>
  );
}

export function CategoryPanel() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
        Categorias
      </p>
      <CategoryList />
    </div>
  );
}
