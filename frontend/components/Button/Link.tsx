"use client";

import type { AriaRole, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonLinkProps {
  href?: string;
  rel?: string;
  target?: string;
  className?: string;
  content?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  role?: AriaRole;
  "aria-selected"?: boolean;
  id?: string;
}

const primary =
  "inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-base font-medium text-white shadow-sm transition-[transform,background-color,box-shadow] duration-200 hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] active:scale-[0.99] sm:w-auto";

const small =
  "inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-[transform,background-color] duration-200 hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] active:scale-[0.99] sm:text-base";

function isActionOnly(onClick?: MouseEventHandler<unknown>, href?: string) {
  return Boolean(onClick) && (!href || href === "#");
}

export function ButtonLink({
  href = "#",
  rel,
  target,
  className,
  content,
  onClick,
  role,
  "aria-selected": ariaSelected,
  id,
}: ButtonLinkProps) {
  const merged = cn(primary, className);
  const a11y = { role, "aria-selected": ariaSelected, id };

  if (isActionOnly(onClick, href)) {
    return (
      <button type="button" onClick={onClick} className={merged} {...a11y}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} rel={rel} target={target} onClick={onClick} className={merged} {...a11y}>
      {content}
    </a>
  );
}

export function SmallButtonLink({
  href = "#",
  rel,
  target,
  className,
  content,
  onClick,
  role,
  "aria-selected": ariaSelected,
  id,
}: ButtonLinkProps) {
  const merged = cn(small, className);
  const a11y = { role, "aria-selected": ariaSelected, id };

  if (isActionOnly(onClick, href)) {
    return (
      <button type="button" onClick={onClick} className={merged} {...a11y}>
        {content}
      </button>
    );
  }

  return (
    <a href={href} rel={rel} target={target} onClick={onClick} className={merged} {...a11y}>
      {content}
    </a>
  );
}
