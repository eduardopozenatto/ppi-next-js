import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormCardProps {
  children: ReactNode;
  className?: string;
}

export function FormCard({ children, className }: FormCardProps) {
  return (
    <section
      className={cn(
        "flex w-full max-w-md flex-col gap-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/95 p-6 shadow-lg shadow-[var(--color-text)]/5 backdrop-blur-sm sm:max-w-lg sm:gap-10 sm:p-8 lg:max-w-xl lg:gap-12 lg:p-10",
        className
      )}
    >
      {children}
    </section>
  );
}
