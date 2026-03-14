import Input from "../components/Input";
import { Link } from "../components/Link";
import { ButtonLink } from "../components/Link";

const Title = function () {
  return (
    <section className="flex justify-center">
      <h1 className="text-6xl bg-[linear-gradient()] font-semibold">
        LabControl
    </h1>
    </section>
  );
};

const Form = function () {
  return (
    <div className="flex flex-col">
      <form action="" className="flex flex-col gap-5">
        <Input type="email" placeholder="Digite seu email: "></Input>
        <Input type="password" placeholder="Insira sua senha: "></Input>
      </form>
      <Link
        content="Esqueceu sua senha?"
        href="#"
        className="mt-2 self-end"
      ></Link>
    </div>
  );
};

const LoginForm = function () {
  return (
    <section className="flex flex-col rounded-2xl bg-white shadow-lg gap-10 max-w-[750px] px-10 py-3 items-center">
      <div className="flex justify-between gap-5 mt-5">
        <ButtonLink 
        content="Login"
        className="w-35 text-center"
        ></ButtonLink>
        
        <ButtonLink
          content="Cadastre-se"
          className="bg-white text-gray-500 hidden min-md:inline"
        ></ButtonLink>
      </div>

      <Form></Form>

      <div className="flex flex-col items-center gap-3 mt-25 mb-3">
        <ButtonLink content="Entrar"></ButtonLink>
        <div>
          <p>
            Não possui cadastro? <Link content="clique aqui"></Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row bg-linear-to-br from-white via-blue-100 to-blue-200 h-screen justify-center items-center gap-10">
      <Title></Title>
      <LoginForm></LoginForm>
    </div>
  );
}
