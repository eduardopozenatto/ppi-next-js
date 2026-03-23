"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LinkTextProps {
  href?: string;
  rel?: string;
  target?: string;
  className?: string;
  content?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

const subtle =
  "text-[var(--color-primary)] underline-offset-2 transition-colors hover:text-[var(--color-primary-hover)] hover:underline";

export function SmallLink({
  href = "#",
  rel,
  target,
  className,
  content,
  onClick,
}: LinkTextProps) {
  const merged = cn(subtle, className);

  if (onClick && (!href || href === "#")) {
    return (
      <button type="button" onClick={onClick} className={merged}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} rel={rel} target={target} onClick={onClick} className={merged}>
      {content}
    </Link>
  );
}
