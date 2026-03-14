import Input from '../General/Input';
import { Link } from '../General/Link';

export default function LoginForm () {
  return (
    <section className="flex flex-col w-full">

      <form action="" className="flex flex-col gap-5">
        <Input type="email" placeholder="Digite seu email: "></Input>
        <Input type="password" placeholder="Insira sua senha: "></Input>
      </form>
      <Link
        content="Esqueceu sua senha?"
        href="#"
        className="mt-2 text-center md:text-end"
      ></Link>
    </section>
  );
};
