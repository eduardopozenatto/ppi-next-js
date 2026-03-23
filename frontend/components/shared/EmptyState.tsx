import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  className?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, className, action }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)]/50 px-6 py-14 text-center",
        className
      )}
    >
      <p className="text-base font-semibold text-[var(--color-text)]">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-[var(--color-text-subtle)]">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
