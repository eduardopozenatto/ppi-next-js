"use client"

import { ButtonLink } from "../../../components/Button/Button";
import { modeProps, setModeProps } from "../../../components/Props/props";


export function Header({mode, setMode}: setModeProps) {
  const classes = "bg-white text-gray-500 md:inline";
  function validation () {
    if (mode == 'recovery') {
      return '';

    } else {
      return setMode('login');
    }
  }

  return (
    <div className= {mode == 'recovery' ? "flex w-full text-center justify-center mt-5 items-center" : "flex justify-evenly gap-5 mt-5 w-full items-center"}>
      <ButtonLink 
        content={mode == 'recovery' ? "Recuperação de senha" : "Login"} 
        onClick={validation} 
        className={mode == 'recovery' ? "w-full" : mode == 'register' ? classes : "max-w-40 text-center"} 
      />

      <ButtonLink
        content="Cadastre-se"
        onClick={() => {setMode('register')}}
        className={mode == 'recovery' ? "hidden" : mode == 'register' ? "w-auto text-center" : classes}
      />
    </div>
  );
}
