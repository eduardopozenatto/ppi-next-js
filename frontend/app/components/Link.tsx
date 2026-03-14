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

export function ButtonLink ({
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
            className= {twMerge("text-white bg-blue-300 px-7 py-4 rounded-2xl max-sm:text-[10px]", className)}

        >{content}</a>
    )
}