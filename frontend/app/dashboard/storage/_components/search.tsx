'use client'

import { useState } from "react";
import Input from "../../../../components/Input/Input";
import Image from "next/image";
import { ShowCat } from "./ShowCat";

export default function SearchTab() {
  const [isActive, setIsActive] = useState(false);

  function handleActive() {
    setIsActive(!isActive)
  }

  return (
    <section className="flex flex-col h-auto">
      <div className="grid grid-cols-[minmax(300px,1fr)_200px] gap-8">
        <div className="">
          <Input type="text" placeholder="Buscar por nome ou descrição..." className="focus-visible:border-gray-400"/>
        </div>
        <div className="flex justify-evenly items-center gap-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300 ease-in-out cursor-pointer">
          <Image src='/filter.svg' alt="icon" width={14} height={14}/>
          <p>todos</p>
          {isActive ? <Image src='/angle-down.svg' alt="icon" width={12} height={12} onClick={handleActive}/> : <Image src='/angle-up.svg' alt="icon" width={12} height={12} onClick={handleActive}/>}
        </div>
      </div>

      {isActive && <div className="absolute top-44 flex self-end w-48 h-auto border-2 justify-center bg-white border-gray-300 mt-3 rounded-md shadow-md z-10">
        <ShowCat />
      </div>}
    </section>
  )
}