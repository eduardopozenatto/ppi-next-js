import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { MouseEventHandler } from "react";

export type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;
    content?: string;
    onClick?: MouseEventHandler;

}

export function SmallLink ({
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
