"use client";

import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className, type = "text", id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          "min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm transition-[border-color,box-shadow] placeholder:text-[var(--color-text-subtle)] hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/25 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4",
          className
        )}
        {...props}
      />
    </div>
  );
});
