"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CollapsibleNoticeProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleNotice({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
}: CollapsibleNoticeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] transition-all duration-200 shadow-xs",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-3.5 text-left transition-colors hover:bg-[var(--color-bg)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && icon !== "ℹ️" ? (
            <span className="text-base shrink-0">{icon}</span>
          ) : (
            <svg
              className="h-4.5 w-4.5 shrink-0 text-[var(--color-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span className="truncate text-xs font-bold text-[var(--color-primary)] sm:text-sm">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[var(--color-text-subtle)]">
          <span className="hidden sm:inline">{isOpen ? "Ocultar" : "Ver instruções"}</span>
          <svg
            className={cn(
              "h-4 w-4 transition-transform duration-200 text-[var(--color-primary)]",
              isOpen ? "rotate-180" : "rotate-0"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-[var(--color-border)] px-4 py-3 text-xs leading-relaxed font-medium text-[var(--color-text)] sm:text-sm animate-fade-in bg-[var(--color-bg)]/30">
          {children}
        </div>
      )}
    </div>
  );
}
