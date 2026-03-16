"use client"

import Form from "./Form";
import EntryButton from "../General/EntryButton";
import { Header } from "../General/Header";
import FormCard from "../General/FormCard";
import { useState } from "react";

import {Mode, setModeProps} from '../../_props/props';


function MainFormSection ({mode, setMode}: setModeProps) {

  return (
    <div className="flex flex-col gap-10 w-full h-full">
        <Header mode={mode} setMode={setMode} />
        <Form mode={mode} />
      </div>
  )
}

export default function FormBody () {
    const [mode, setMode] = useState<Mode>('login'); 

  return (
    <>

    <FormCard 
      content={[
        <MainFormSection 
          mode={mode} 
          setMode={setMode} 
          key={0} 
        />, 

        <EntryButton 
          mode={mode} 
          key={1}
        />
        
      ]} 
      />

    </>
  );
}