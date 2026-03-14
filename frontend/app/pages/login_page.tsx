import Input from '../components/Input';
import { Link } from '../components/Link';
import { ButtonLink } from '../components/Link';

const Aside = function () {
    return (
        <section className="flex justify-center">
            <h1 className='text-[50px]'>LabControl</h1>
        </section>
    )
}

const LoginForm = function () {
    return (
        <section className='flex flex-col h-auto border-solid border-gray-700 gap-5'>
            <div className='flex justify-center'>
                <ButtonLink content='Login'></ButtonLink>
                <ButtonLink content='Cadastre-se'></ButtonLink>
            </div>

            <div>
                <form action = "" className = "flex flex-col mt-10 gap-5 justify-center max-sm:items-center" >
                    <Input type='email' placeholder='Digite seu email: '></Input>
                    <Input type='password' placeholder='Insira sua senha: '></Input>
                </form> 
            </div>

        </section>

    );
};

export function LoginPage() {
    return (
        <div className='flex flex-col'>
            <Aside></Aside>
            <LoginForm></LoginForm>
        </div>
    );
}