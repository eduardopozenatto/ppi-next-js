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
  if (!ctx) {
    return {
      addToast: (t: Omit<ToastData, "id">) => console.log("[Toast Fallback]", t),
    };
  }
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
function SuccessIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const variantConfig: Record<
  ToastVariant,
  {
    borderLeft: string;
    iconBg: string;
    titleColor: string;
    Icon: () => React.JSX.Element;
  }
> = {
  success: {
    borderLeft: "border-l-emerald-500",
    iconBg: "bg-emerald-500 text-white",
    titleColor: "text-emerald-700 dark:text-emerald-400",
    Icon: SuccessIcon,
  },
  error: {
    borderLeft: "border-l-red-500",
    iconBg: "bg-red-500 text-white",
    titleColor: "text-red-700 dark:text-red-400",
    Icon: ErrorIcon,
  },
  info: {
    borderLeft: "border-l-[var(--color-primary)]",
    iconBg: "bg-[var(--color-primary)] text-white",
    titleColor: "text-[var(--color-primary)] dark:text-blue-400",
    Icon: InfoIcon,
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

  const config = variantConfig[toast.variant];
  const IconComponent = config.Icon;

  return (
    <div
      className={`pointer-events-auto flex w-84 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-2xl bg-[var(--color-bg)] dark:bg-[var(--color-surface-elevated)] border border-[var(--color-border)] border-l-4 ${config.borderLeft} p-4 shadow-xl backdrop-blur-sm transition-all duration-300 ${
        show ? "translate-x-0 opacity-100 scale-100" : "translate-x-8 opacity-0 scale-95"
      }`}
      role="alert"
    >
      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${config.iconBg}`}>
        <IconComponent />
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${config.titleColor}`}>{toast.title}</p>
        {toast.message && (
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-subtle)]">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => { setShow(false); setTimeout(onDismiss, 300); }}
        className="shrink-0 rounded-lg p-1 text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]"
        aria-label="Fechar notificação"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
