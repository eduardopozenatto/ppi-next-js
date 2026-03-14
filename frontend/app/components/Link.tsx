import { twMerge } from "tailwind-merge";

type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;

}

export default function Link ({
    href = "#",
    rel,
    target,
    type,
    className,

}: LinkProps) {
    return (
        <a 
            href={href}
            rel={rel}
            target={target}
            type={type}
            className= {twMerge("", className)}

        ></a>
    )
}