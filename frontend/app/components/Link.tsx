import { twMerge } from "tailwind-merge";

type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;
    content?: string;

}

export function Link ({
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
}: LinkProps) {
  return (
    <a
      href={href}
      rel={rel}
      target={target}
      type={type}
      className={twMerge(
        "inline-block text-white bg-blue-300 rounded-[7px] px-5 py-3 text-3xl hover:opacity-[0.7] 1s transition-opacity max-md:text-2xl",
        className
      )}
    >
      {content}
    </a>
  );
}