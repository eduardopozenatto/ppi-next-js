"use client"

import { ButtonLink } from "../../../components/Button/Button";
import { setModeProps } from "../../../components/Props/props";


export function Header({mode, setMode}: setModeProps) {
  const classes = "bg-white text-gray-500 md:inline";

  return (
    <div className="flex justify-evenly gap-5 mt-5 w-full items-center">
      <ButtonLink 
        content="Login" 
        onClick={() => {setMode('login')}} 
        className={mode == 'recovery' ? "max-w-50" : mode == 'register' ? classes : "max-w-40 text-center"} 
      />

      <ButtonLink
        content="Cadastre-se"
        onClick={() => {setMode('register')}}
        className={mode == 'recovery' ? "hidden" : mode == 'register' ? "w-auto text-center" : classes}
      />
    </div>
  );
}
