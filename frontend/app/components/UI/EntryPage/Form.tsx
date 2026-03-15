import Input from '../General/Input';
import { Link } from '../General/Link';

interface formProps {
  isLogin: boolean
}

export default function Form ({isLogin}: formProps) {

  const LoginInputs = [
  {type: "email", placeholder: "Digite seu email: "},
  {type: "password", placeholder: "Insira sua senha: "},
]

const RegisterInputs = [
  {type: "text", placeholder: "Insira seu nome: "}, 
  {type: "email", placeholder: "Insira seu email: "},
  {type: "number", placeholder: "Digite sua matrícula (SIAPE ou discente): "},
  {type: "password", placeholder: "Digite sua senha: "},
  {type: "password", placeholder: "Digite sua senha: "},
]

  return (
    <section className="flex flex-col w-full">

      <form action="" className="flex flex-col gap-5">
        {(isLogin ? LoginInputs : RegisterInputs).map((item, index) => (
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
        className={ isLogin ? "mt-2 text-center md:text-end" : "hidden"}
      ></Link>
    </section>
  );
};
