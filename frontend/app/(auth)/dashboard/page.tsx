import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDate } from "@/lib/utils";
import { MOCK_INVENTORY_ITEMS } from "@/mocks/inventory-items";
import { MOCK_LOANS } from "@/mocks/loans";
import { MOCK_NOTIFICATIONS } from "@/mocks/notifications";

export default function DashboardPage() {
  const activeLoans = MOCK_LOANS.filter((l) => l.status === "active").length;
  const pendingLoans = MOCK_LOANS.filter((l) => l.status === "pending").length;
  const inventory = Object.values(MOCK_INVENTORY_ITEMS);
  const totalAvailable = inventory.reduce((acc, i) => acc + i.availableQuantity, 0);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const stats = [
    { label: "Empréstimos ativos", value: String(activeLoans), href: "/loans" },
    { label: "Pedidos pendentes", value: String(pendingLoans), href: "/approvals" },
    { label: "Itens disponíveis", value: String(totalAvailable), href: "/items" },
    { label: "Notificações novas", value: String(unread), href: "/notifications" },
  ];

  const recent = MOCK_LOANS.slice(0, 4);

  return (
    <div>
      <PageHeader
        title="Painel"
        description="Resumo do laboratório — estoque, empréstimos e alertas."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-[var(--color-text-subtle)]">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text)]">{s.value}</p>
            <span className="mt-3 inline-flex text-sm font-semibold text-[var(--color-primary)]">
              Ver detalhes →
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Empréstimos recentes</h2>
          <Link href="/loans" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
            Ver todos
          </Link>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">
          {recent.map((loan) => (
            <li key={loan.id} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[var(--color-text)]">{loan.borrowerName}</p>
                <p className="text-sm text-[var(--color-text-subtle)]">
                  {loan.items.map((i) => i.inventoryItemName).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-subtle)]">
                  Devolução {formatDate(loan.dueDate)}
                </span>
                <Link
                  href={`/loans/${loan.id}`}
                  className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Abrir
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
