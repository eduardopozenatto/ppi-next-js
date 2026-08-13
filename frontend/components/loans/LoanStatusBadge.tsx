import type { LoanStatus } from "@/types/loan";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  LoanStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pendente",
    className: "bg-[var(--color-bg-subtle)] text-[var(--color-warning)] border border-[var(--color-border-strong)]",
  },
  active: {
    label: "Ativo",
    className: "bg-[var(--color-bg-subtle)] text-[var(--color-primary)] border border-[var(--color-border-strong)]",
  },
  overdue: {
    label: "Atrasado",
    className: "bg-[var(--color-bg-subtle)] text-[var(--color-danger)] border border-[var(--color-danger)]/50",
  },
  returned: {
    label: "Devolvido",
    className: "bg-[var(--color-bg-subtle)] text-[var(--color-success)] border border-[var(--color-border-strong)]",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-[var(--color-bg-subtle)] text-[var(--color-text-subtle)] border border-[var(--color-border)] opacity-70",
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
