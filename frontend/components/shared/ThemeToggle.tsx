"use client";

import { useTheme } from "@/contexts/ThemeContext";

export interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] shadow-sm transition-all duration-200 hover:bg-[var(--color-bg-subtle)] active:scale-95 ${
        compact ? "p-2" : "w-full px-3.5 py-2.5"
      }`}
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {isDark ? (
          /* Ícone de Sol ☀️ */
          <svg
            className="h-5 w-5 text-amber-400 transition-transform duration-300 group-hover:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          /* Ícone de Lua 🌙 */
          <svg
            className="h-5 w-5 text-sky-600 transition-transform duration-300 group-hover:-rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </span>

      {!compact ? (
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {isDark ? "Modo Claro" : "Modo Escuro"}
        </span>
      ) : null}
    </button>
  );
}
