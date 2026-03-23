"use client";

import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from "react";

/* ---------- Toast types ---------- */
export type ToastVariant = "success" | "error" | "info";

interface ToastData {
  id: number;
  title: string;
  message?: string;
  variant: ToastVariant;
}

/* ---------- Context ---------- */
interface ToastContextValue {
  addToast: (t: Omit<ToastData, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ---------- Provider ---------- */
let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((t: Omit<ToastData, "id">) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ---------- Single toast ---------- */
const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; titleColor: string }> = {
  success: {
    bg: "bg-white",
    border: "border-l-4 border-l-emerald-500",
    icon: "✓",
    titleColor: "text-emerald-600",
  },
  error: {
    bg: "bg-white",
    border: "border-l-4 border-l-red-500",
    icon: "✕",
    titleColor: "text-red-600",
  },
  info: {
    bg: "bg-white",
    border: "border-l-4 border-l-blue-500",
    icon: "ℹ",
    titleColor: "text-blue-600",
  },
};

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const v = variantStyles[toast.variant];

  return (
    <div
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl ${v.bg} ${v.border} border border-[var(--color-border)] p-4 shadow-lg transition-all duration-300 ${
        show ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
      role="alert"
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
        toast.variant === "success" ? "bg-emerald-500" : toast.variant === "error" ? "bg-red-500" : "bg-blue-500"
      }`}>
        {v.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${v.titleColor}`}>{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-xs text-[var(--color-text-subtle)]">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => { setShow(false); setTimeout(onDismiss, 300); }}
        className="shrink-0 rounded p-0.5 text-[var(--color-text-subtle)] transition-colors hover:text-[var(--color-text)]"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
}
