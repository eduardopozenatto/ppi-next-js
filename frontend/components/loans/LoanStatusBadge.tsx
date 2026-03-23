import type { LoanStatus } from "@/types/loan";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  LoanStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  },
  active: {
    label: "Ativo",
    className: "bg-azure-100 text-azure-900 ring-1 ring-azure-200",
  },
  overdue: {
    label: "Atrasado",
    className: "bg-red-100 text-red-900 ring-1 ring-red-200",
  },
  returned: {
    label: "Devolvido",
    className: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
  },
};

export interface LoanStatusBadgeProps {
  status: LoanStatus;
  className?: string;
}

export function LoanStatusBadge({ status, className }: LoanStatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        cfg.className,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
