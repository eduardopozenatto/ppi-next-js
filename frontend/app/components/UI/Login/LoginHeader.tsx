"use client"

import { use, useState } from "react";
import { ButtonLink } from "../General/Link";

export default function LoginHeader() {
  const classes = "bg-white text-gray-500 hidden md:inline";
  const [HaveAccount, ChangeDisplay] = useState(true);

  return (
    <div className="flex justify-evenly gap-5 mt-5 self-center w-full">
      <ButtonLink content="Login" onClick={() => {ChangeDisplay(HaveAccount ? HaveAccount : !HaveAccount)}} className={HaveAccount ? "w-auto text-center" : classes} ></ButtonLink>

      <ButtonLink
        content="Cadastre-se"
        onClick={() => {ChangeDisplay(HaveAccount ? !HaveAccount : HaveAccount)}}
        className={HaveAccount ? classes : "w-auto text-center"}
      ></ButtonLink>
    </div>
  );
}
