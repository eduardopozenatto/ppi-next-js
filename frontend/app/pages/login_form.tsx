import Input from '../components/Input';
import { Link } from '../components/Link';
import { ButtonLink } from '../components/Link';

export function LoginForm () {
    return (
        <main>
            <section className="flex flex-col justify-center p-10 max-md:pt-10; lg:items-center">
                <h1 className="text-6xl font-sans self-center max-sm:text-[100px]">LabControl</h1>

                <div className="flex flex-col border rounded-2xl px-10 py-8 mt-10 lg:w-200 gap-5">

                    <div className="flex gap-20 text-3xl mt-5 justify-center max-sm:gap-10">
                        <div>
                            <ButtonLink content='Login' className='max-sm:text-[10px]'></ButtonLink>
                        </div>
                        <div>
                            <Link content='Cadastro' className='text-gray-400 hover:no-underline'></Link>
                        </div>
                    </div>
                
                    <form action="" className="flex flex-col mt-10 gap-5 justify-center max-sm:items-center">
                        <Input type='email' placeholder='Digite seu email: '></Input>
                        <Input type='password' placeholder='Insira sua senha: '></Input>
                    </form> 

                    <Link content='Esqueceu a senha?' className='text-end mr-1'></Link>

                    <div className='flex flex-col mt-5 items-center'>
                        <hr className='h-0.5 bg-gray-300 border-0 w-50'/>
                    </div>
                    <div className='flex justify-center items-center my-5'>
                        <ButtonLink content='Entrar'></ButtonLink>
                    </div>

                    <div className='flex justify-center'>
                        <p className='text-[100px]'>não possui cadastro? <Link content='Clique aqui' className=''></Link></p>
                    </div>
                 </div>
            </section>
        </main>
    );
}