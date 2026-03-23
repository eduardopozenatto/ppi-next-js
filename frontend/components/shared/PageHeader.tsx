import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, className, actions }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-3 border-b border-[var(--color-border)] pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm text-[var(--color-text-subtle)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
