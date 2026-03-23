import { PageHeader } from "@/components/shared/PageHeader";
import Link from "next/link";

const settingsCards = [
  {
    href: "/admin/settings/categories",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    title: "Categorias",
    description: "Gerencie as categorias de itens do estoque",
    stat: "4 categorias",
    color: "#0f62fe",
  },
  {
    href: "/admin/settings/tags",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
    title: "Tags (Perfis de Acesso)",
    description: "Configure níveis de permissão padronizados",
    stat: "3 tags",
    color: "#24a148",
  },
  {
    href: "/admin/settings/permissions",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Permissões Individuais",
    description: "Sobrescreva as permissões da tag para usuários específicos",
    stat: "1 override ativo",
    color: "#8a3ffc",
  },
];

export default function AdminSystemSettingsPage() {
  return (
    <div>
      <PageHeader
        title="Configurações do sistema"
        description="Gerencie tags, categorias e permissões individuais do LabControl."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-2">
        {settingsCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ borderBottomColor: card.color, borderBottomWidth: 3 }}
          >
            {/* Icon */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: card.color + "15", color: card.color }}
            >
              {card.icon}
            </div>

            {/* Content */}
            <div>
              <h2 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text-subtle)]">{card.description}</p>
            </div>

            {/* Stat + Arrow */}
            <div className="mt-auto flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ backgroundColor: card.color + "15", color: card.color }}
              >
                {card.stat}
              </span>
              <span className="text-[var(--color-text-subtle)] transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
