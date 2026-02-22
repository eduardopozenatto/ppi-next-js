import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type InputProps = {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    ClassName?: string;
};

export default function Input ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    name,
    ClassName,

}: InputProps) {
    return (
        <div className="flex flex-1">
            {label && <label>{label}</label>}
            <input 
                type={type} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                className={twMerge("flex-1 border-gray-300 border-solid border-2 rounded-lg py-2 px-4", ClassName)}
            />
        </div>
    )
}