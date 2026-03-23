"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Slogan } from "@/components/Body/Slogan";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]/95 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-bg-subtle)]/80 lg:hidden">
        <Slogan compact />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-bg-subtle)]"
          aria-expanded={open}
          aria-controls="app-sidebar"
        >
          Menu
        </button>
      </header>

      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[minmax(0,17.5rem)_1fr]">
        {open ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-40 bg-[var(--color-text)]/25 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <aside
          id="app-sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-subtle)] transition-transform duration-200 ease-out lg:static lg:z-0 lg:w-auto lg:translate-x-0 lg:rounded-r-3xl lg:border-r-0 lg:shadow-none",
            open ? "translate-x-0 shadow-2xl shadow-[var(--color-text)]/10" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 lg:hidden">
            <span className="text-sm font-semibold text-[var(--color-text)]">Navegação</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-lg leading-none text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              aria-label="Fechar"
            >
              ×
            </button>
          </div>

          <div className="hidden lg:block">
            <Slogan />
          </div>
          <hr className="mx-auto hidden w-[82%] border-[var(--color-border)] lg:block" />

          <nav
            className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-2 py-4"
            onClick={() => setOpen(false)}
          >
            <AppSidebar />
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
