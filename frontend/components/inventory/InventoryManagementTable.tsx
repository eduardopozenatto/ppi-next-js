"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { ApiResponse } from "@/types/api";
import type { LabInventoryListItem } from "@/types/lab-inventory";

export function InventoryManagementTable() {
  const [rows, setRows] = useState<LabInventoryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ApiResponse<LabInventoryListItem[]>>("/inventory");
        setRows(res.data ?? []);
      } catch (err) {
        addToast({ title: "Erro", message: "Falha ao carregar estoque", variant: "error" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [addToast]);

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm"
      )}
    >
      <table className="w-full min-w-[42rem] text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-subtle)]">
          <tr>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="hidden px-4 py-3 sm:table-cell">Total</th>
            <th className="px-4 py-3">Disponível</th>
            <th className="px-4 py-3">Emprestados</th>
            <th className="px-4 py-3 text-end">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {loading ? (
             <tr><td colSpan={6} className="px-4 py-4 text-center text-[var(--color-text-subtle)]">Carregando...</td></tr>
          ) : rows.length === 0 ? (
             <tr><td colSpan={6} className="px-4 py-4 text-center text-[var(--color-text-subtle)]">Nenhum item encontrado.</td></tr>
          ) : rows.map((item) => (
            <tr key={item.id} className="hover:bg-[var(--color-bg-subtle)]/60">
              <td className="px-4 py-3 font-medium text-[var(--color-text)]">{item.name}</td>
              <td className="px-4 py-3 text-[var(--color-text-subtle)]">{item.category}</td>
              <td className="hidden px-4 py-3 sm:table-cell">{item.quantity}</td>
              <td className="px-4 py-3">{item.availableQuantity}</td>
              <td className="px-4 py-3">{item.loanedQuantity}</td>
              <td className="px-4 py-3 text-end">
                <Link
                  href={`/inventory/${item.id}`}
                  className="font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
