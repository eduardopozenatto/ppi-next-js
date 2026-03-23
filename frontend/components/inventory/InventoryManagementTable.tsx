import Link from "next/link";
import { MOCK_INVENTORY_ITEMS } from "@/mocks/inventory-items";
import { cn } from "@/lib/utils";

export function InventoryManagementTable() {
  const rows = Object.values(MOCK_INVENTORY_ITEMS);

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
          {rows.map((item) => (
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
