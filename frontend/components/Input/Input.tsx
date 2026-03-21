"use client";
import React, { useId } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
}

export function Input({
    label,
    className,
    type = "text",
    id,
    ...props
}: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
        <div className="flex w-full flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                className={twMerge(
                    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-base transition-all duration-200 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-azure-500 focus:outline-none focus:ring-2 focus:ring-azure-500/20 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    )
}