"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-medium transition-[transform,box-shadow,background-color] duration-200 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:min-w-[8rem]",
        variant === "primary" &&
          "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
        variant === "secondary" &&
          "border border-[var(--color-border-strong)] bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
        variant === "ghost" &&
          "text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
