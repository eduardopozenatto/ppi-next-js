import Input from '../General/Input';
import { Link } from '../General/Link';
import { modeProps } from '@/app/_props/props';

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

export default function Form ({ mode }: modeProps) {

  const inputs = input_groups[mode];

  return (
    <section className="flex flex-col w-full">

      <form action="" className="flex flex-col gap-5">
        {inputs.map((item, index) => (
          <Input 
          key={index}
          type={item.type} 
          placeholder={item.placeholder}
          />
        ))}
      </form>

      <Link
        content="Esqueceu sua senha?"
        href="#"
        className={ mode == 'login' ? "mt-2 text-center md:text-end" : "hidden"}
      ></Link>
    </section>
  );
};
