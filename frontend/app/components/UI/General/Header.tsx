"use client"

import { Dispatch, SetStateAction } from "react";
import { ButtonLink } from "./Link";

interface headerProps {
  isLogin: boolean,
  setIsLogin: Dispatch<SetStateAction<boolean>>
} 

export default function Header({isLogin, setIsLogin}: headerProps) {
  const classes = "bg-white text-gray-500 md:inline";

  return (
    <div className="flex justify-evenly gap-5 mt-5 self-center w-full">
      <ButtonLink content="Login" onClick={() => {setIsLogin(isLogin ? isLogin : !isLogin)}} className={isLogin ? "w-auto text-center" : classes} ></ButtonLink>

      <ButtonLink
        content="Cadastre-se"
        onClick={() => {setIsLogin(isLogin ? !isLogin : isLogin)}}
        className={isLogin ? classes : "w-auto text-center"}
      ></ButtonLink>
    </div>
  );
}
