'use client'

import Input from '../../../components/Input/Input';
import { SmLink } from '../../../components/Link/Link';
import { setModeProps } from '../../../components/Props/props';

interface InputItem {
  type: string;
  placeholder: string;
}

const input_groups: Record<'login' | 'register' | 'recovery', InputItem[]> = {
    login: [
        {type: "email", placeholder: "Digite seu email: "},
        {type: "password", placeholder: "Insira sua senha: "},
    ],
    register: [
      {type: "text", placeholder: "Insira seu nome: "}, 
      {type: "email", placeholder: "Insira seu email: "},
      {type: "number", placeholder: "Digite sua matrícula (SIAPE ou discente): "},
      {type: "password", placeholder: "Digite sua senha: "},
      {type: "password", placeholder: "Digite sua senha: "},
    ],
    recovery: [
      {type: "email", placeholder: "Insira seu email: "},
    ],
  };

export default function Form ({mode, setMode}: setModeProps) {

  const inputs = input_groups[mode];

  return (
    <section className="flex flex-col w-full">

      <div className='mb-7 text-center text-gray-500'>
        {mode == 'recovery' && <><p>Digite seu e-mail no campo abaixo para receber seu código de recuperação: </p></>}
      </div>

      <form action="" className="flex flex-col gap-5">
        {inputs.map((item, index) => (
          <Input 
          key={index}
          type={item.type} 
          placeholder={item.placeholder}
          />
        ))}
      </form>

      <SmLink
        content="Esqueceu sua senha?"
        onClick={() => {setMode('recovery')}}
        className={ mode == 'login' ? "mt-2 text-end" : "hidden"}
      />
    </section>
  );
};
