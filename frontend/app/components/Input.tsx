import React from "react";
// utilização do tailwind-merge para deixar o componente flexível permitindo sobrescrever suas classes conforme necessário
import { twMerge } from "tailwind-merge";

// tipo da função Input, com todos os valores necessários para o input

// o ? na frente de cada variável significa que ela é opcional, e não obrigatória, 
// o que possibilita omitir certas propriedades desnecessárias

type InputProps = {
    label?: string;
    type?: React.HTMLInputTypeAttribute;
    value?: string;
    onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    ClassName?: string;
};

// Função com a entrada dos valores do input

export default function Input ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    name,
    ClassName,

}: /* definindo o tipo do input com o tipo criado acima */ InputProps) {
    return (
        <div className="flex flex-1">
            {/* label opcional para inserir junto ao input */}
            {label && <label>{label}</label>}
            <input 
            // input com suas propriedades
                type={type} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                // utilizando o twMerge para juntar as classes definidas com as classes individuais (as individuais tem mais prioridade)
                className={twMerge("flex-1 border-gray-300 border-solid border-2 rounded-lg py-2 px-4", ClassName)}
            />
        </div>
    )
}