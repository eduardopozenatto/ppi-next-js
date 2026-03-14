import { twMerge } from "tailwind-merge";

type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;
    content: string;

}

export default function Link ({
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