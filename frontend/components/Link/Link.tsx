import { twMerge } from "tailwind-merge";
import { LinkProps } from "../Props/props";

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
