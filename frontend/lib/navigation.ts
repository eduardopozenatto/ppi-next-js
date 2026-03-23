import type { LabSessionUser } from "@/types/lab-session";

export type NavItemId =
  | "items"
  | "loans"
  | "notifications"
  | "storage"
  | "aprovations"
  | "users"
  | "reports"
  | "config"
  | "carshop";

export interface NavItemConfig {
  id: NavItemId;
  href: string;
  label: string;
  iconSrc: string;
  /** Chave em userPermissions; omitido = sempre visível quando a secção aparece */
  permission?: keyof LabSessionUser["userPermissions"];
  section: "main" | "admin" | "footer";
}

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "items",
    href: "/items",
    label: "Buscar itens",
    iconSrc: "/buttonIcons/search.svg",
    permission: "verItens",
    section: "main",
  },
  {
    id: "loans",
    href: "/loans",
    label: "Empréstimos",
    iconSrc: "/buttonIcons/calendar.svg",
    permission: "pedirEmprestimos",
    section: "main",
  },
  {
    id: "notifications",
    href: "/notifications",
    label: "Notificações",
    iconSrc: "/buttonIcons/bell.svg",
    permission: "VerNotificacoes",
    section: "main",
  },
  {
    id: "storage",
    href: "/inventory",
    label: "Estoque",
    iconSrc: "/buttonIcons/box.svg",
    permission: "VerEstoque",
    section: "main",
  },
  {
    id: "aprovations",
    href: "/approvals",
    label: "Aprovações",
    iconSrc: "/buttonIcons/aprovation.svg",
    permission: "AprovEmprestimos",
    section: "admin",
  },
  {
    id: "users",
    href: "/admin/users",
    label: "Usuários",
    iconSrc: "/buttonIcons/users.svg",
    permission: "GerenciarUsuarios",
    section: "admin",
  },
  {
    id: "reports",
    href: "/admin/reports",
    label: "Relatórios",
    iconSrc: "/buttonIcons/reports.svg",
    permission: "GerarRelatorios",
    section: "admin",
  },
  {
    id: "config",
    href: "/settings",
    label: "Configurações",
    iconSrc: "/buttonIcons/settings.svg",
    section: "footer",
  },
  {
    id: "carshop",
    href: "/cart",
    label: "Carrinho",
    iconSrc: "/buttonIcons/carshop.svg",
    section: "footer",
  },
];

export function isLabAdmin(user: LabSessionUser): boolean {
  return user.tag.name === "laboratorista";
}

export function navVisible(item: NavItemConfig, user: LabSessionUser): boolean {
  if (item.permission && !user.userPermissions[item.permission]) return false;
  if (item.section === "admin" && !isLabAdmin(user)) return false;
  return true;
}
