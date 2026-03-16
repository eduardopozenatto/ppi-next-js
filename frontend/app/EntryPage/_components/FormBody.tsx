"use client"
import { useState } from "react";
import {Mode, setModeProps} from '../../../components/Props/props';

import { Header } from "./Header";
import Form from "./Form";
import EntryButton from "./EntryButton";
import FormCard from "../../../components/Body/FormCard";

function MainFormSection ({mode, setMode}: setModeProps) {

  return (
    <div className="flex flex-col gap-10 w-full h-full">
        <Header mode={mode} setMode={setMode} />
        <Form mode={mode} setMode={setMode}/>
      </div>
  )
}

export default function FormBody () {
    const [mode, setMode] = useState<Mode>('login'); 

  return (
    <div>

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

    </div>
  );
}