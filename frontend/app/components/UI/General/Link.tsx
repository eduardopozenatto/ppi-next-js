import { MouseEventHandler } from "react";
import { twMerge } from "tailwind-merge";

type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;
    content?: string;
    onClick?: MouseEventHandler;

}

export function Link ({
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
            className= {twMerge("text-blue-300 hover:underline", className)}

        >{content}</a>
    )
}

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
        "inline-block text-white bg-blue-300 rounded-[14px] px-5 py-3 text-2xl hover:opacity-[0.7] 1s transition-opacity max-md:text-2xl flex-nowrap",
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
          "inline text-white text-center text-md md:text-2xl bg-blue-300 rounded-[14px] px-5 py-3 w-[200px] hover:opacity-[0.7] 1s transition-opacity flex-nowrap",
          className
        )}
      >
        {content}
      </a>
    );
}