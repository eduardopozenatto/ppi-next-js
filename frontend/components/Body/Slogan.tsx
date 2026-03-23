import { cn } from "@/lib/utils";

export interface SloganProps {
  compact?: boolean;
  className?: string;
}

export function Slogan({ compact, className }: SloganProps) {
  return (
    <div className={cn(compact ? "px-0" : "px-3 pt-3 lg:pt-5", className)}>
      <p
        className={cn(
          "text-center font-semibold tracking-tight text-[var(--color-text)]",
          compact ? "text-base" : "text-xl lg:text-2xl"
        )}
      >
        LabControl
      </p>
    </div>
  );
}
