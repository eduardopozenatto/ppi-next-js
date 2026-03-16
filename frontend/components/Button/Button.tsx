import { LinkProps } from "../Props/props";
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
        "inline-block text-white bg-blue-300 rounded-[14px] px-5 py-3 text-xl hover:opacity-[0.7] 1s transition-opacity max-md:text-lg flex-nowrap",
        className
      )}
    >
      {content}
    </a>
  );
}

export function SmButtonLink({
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
          "inline text-white text-center text-md md:text-xl bg-blue-300 rounded-[14px] px-5 py-3 w-50 hover:opacity-[0.7] 1s transition-opacity flex-nowrap",
          className
        )}
      >
        {content}
      </a>
    );
}