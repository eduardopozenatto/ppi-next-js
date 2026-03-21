"use client";
import React from "react";
import { LinkProps } from "../../components/Link/Link";
import { twMerge } from "tailwind-merge";

export function ButtonLink({
  href = "#",
  rel,
  target,
  type,
  className,
  content,
  onClick
}: LinkProps) {
  return (
    <a
      href={href}
      rel={rel}
      target={target}
      type={type}
      onClick={onClick}
      className={twMerge(
        "w-full md:w-auto inline-flex items-center justify-center text-white bg-azure-500 rounded-xl px-5 py-3 text-base md:text-lg font-medium hover:bg-azure-600 focus:outline-none focus:ring-2 focus:ring-azure-500 focus:ring-offset-2 transition-all active:scale-[0.98]",
        className
      )}
    >
      {content}
    </a>
  );
}

export function SmallButtonLink({
  href = "#",
  rel,
  target,
  type,
  className,
  content,
}: LinkProps) {
  return (
      <a
        href={href}
        rel={rel}
        target={target}
        type={type}
        className={twMerge(
          "inline-flex items-center justify-center text-white text-sm md:text-base bg-azure-500 rounded-lg px-4 py-2 hover:bg-azure-600 focus:outline-none focus:ring-2 focus:ring-azure-500 focus:ring-offset-2 transition-all active:scale-[0.98]",
          className
        )}
      >
        {content}
      </a>
    );
}
