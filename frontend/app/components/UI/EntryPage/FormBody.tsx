"use client"

import Form from "./Form";
import EntryButton from "../General/EntryButton";
import Header from "../General/Header";
import FormCard from "../General/FormCard";
import { Dispatch, SetStateAction, useState } from "react";

interface MainFormSectionProps {
  isLogin: boolean,
  setIsLogin: Dispatch<SetStateAction<boolean>>
}

function MainFormSection ({isLogin, setIsLogin}: MainFormSectionProps) {

  return (
    <div className="flex flex-col gap-10 w-full h-full">
        <Header isLogin={isLogin} setIsLogin={setIsLogin} />
        <Form isLogin={isLogin} />
      </div>
  )
}

export default function FormBody () {
    const [isLogin, setIsLogin] = useState(true); 

  return (
    <>

    <FormCard 
      content={[
        <MainFormSection 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
        key={0} />, 

        <EntryButton 
        isLogin={isLogin} 
        key={1}/>
        
      ]} 
      />

    </>
  );
}