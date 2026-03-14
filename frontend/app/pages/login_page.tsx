import Input from '../components/Input';
import { Link } from '../components/Link';
import { ButtonLink } from '../components/Link';

const Aside = function () {
    return (
        <section className="flex justify-center">
            <h1 className='text-6xl'>LabControl</h1>
        </section>
    )
}

const LoginForm = function () {
    return (
        <section className='flex flex-col border-solid border-2 rounded-2xl bg-white border-gray-700 gap-10 w-fit h-auto justify-center items-center mt-[10px] p-4'>
 
            <div className='flex justify-center gap-5 mt-2.5 '>
                <ButtonLink content='Login'></ButtonLink>
                <ButtonLink content='Cadastre-se' className=''></ButtonLink>
            </div>

            <div className='flex flex-col justify-center items-center w-[500px]'>
                <form action = "" className = "flex flex-col gap-5 justify-center items-center" >
                    <Input type='email' placeholder='Digite seu email: '></Input>
                    <Input type='password' placeholder='Insira sua senha: '></Input>
                </form> 
                <Link content='Esqueceu sua senha?' href='#' className='mt-2 mr-22 self-end'></Link>
            </div>

        </section>

    );
};

export function LoginPage() {
    return (
        <div className='flex flex-col bg-linear-to-br from-white via-blue-100 to-blue-200 h-screen justify-center items-center gap-8'>
                <Aside></Aside>
                <LoginForm></LoginForm>

                
        </div>
    );
}