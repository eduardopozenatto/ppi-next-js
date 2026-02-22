import React from "react";

type InputProps = {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
};

export default function Input ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    name,
}: InputProps) {
    return (
        <div>
        </div>
    )
}