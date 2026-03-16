import { twMerge } from "tailwind-merge";
import { LinkProps } from "../Props/props";
import Link from "next/link";

export function SmLink ({
    href = "#",
    rel,
    target,
    type,
    className,
    content,
    onClick

}: LinkProps) {
    return (
        <Link 
        href={href}
        rel={rel}
        target={target}
        type={type}
        onClick={onClick}
        className= {twMerge("text-blue-300 hover:underline", className)}
        >
        {content}
        </Link>
    )
}
