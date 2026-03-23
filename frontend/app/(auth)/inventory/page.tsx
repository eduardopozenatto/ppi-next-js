import Link from "next/link";
import { InventoryManagementTable } from "@/components/inventory/InventoryManagementTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default function InventoryListPage() {
  return (
    <div>
      <PageHeader
        title="Estoque"
        description="Visão consolidada das quantidades e ligações rápidas para cada item."
        actions={
          <Link
            href="/inventory/new"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)]"
          >
            Adicionar item
          </Link>
        }
      />
      <InventoryManagementTable />
    </div>
  );
}
