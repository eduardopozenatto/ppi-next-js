"use client"

import { ButtonLink } from "@/components/Button/Link";
import { Mode } from "../../types";

type HeaderProps = {
  mode?: Mode;
  setMode?: (mode: Mode) => void;
};

export function Header({ mode = 'login', setMode = () => {} }: HeaderProps) {
  const inactiveClasses = "bg-transparent text-gray-500 hover:bg-gray-200 transition-colors border-none shadow-none";
  const activeClasses = "bg-blue-600 text-white shadow-md";

  if (mode === 'recovery') {
    return (
      <div className="flex w-full justify-center mt-6 mb-2">
        <h2 className="text-2xl font-semibold text-gray-800">Recuperação de Senha</h2>
      </div>
    );
  }

  return (
    <div className="flex w-full bg-gray-100 p-1 rounded-lg mt-5 mb-2">
      <ButtonLink 
        content="Login"
        onClick={() => setMode('login')} 
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          mode === 'login' ? activeClasses : inactiveClasses
        }`} 
      />

      <ButtonLink
        content="Cadastre-se"
        onClick={() => setMode('register')}
        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
          mode === 'register' ? activeClasses : inactiveClasses
        }`}
      />
    </div>
  );
}
