"use client"

import { ButtonLink } from "../../../components/Button/Button";
import { setModeProps } from "../../../components/Props/props";


export function Header({mode, setMode}: setModeProps) {
  const classes = "bg-white text-gray-500 md:inline";

  return (
    <div className="flex justify-evenly gap-5 mt-5 self-center w-full items-center">
      <ButtonLink 
        content={mode == 'recovery' ? 'Recuperar senha' : 'Login'} 
        onClick={() => {setMode('login')}} 
        className={mode == 'register' ? classes : "max-w-40 text-center"} 
      />

      <ButtonLink
        content="Cadastre-se"
        onClick={() => {setMode('register')}}
        className={mode == 'register' ? "w-auto text-center" : classes}
      />
    </div>
  );
}
