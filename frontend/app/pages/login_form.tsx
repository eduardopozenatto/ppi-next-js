import Input from '../components/Input'

export function LoginForm () {
    return (
        <main>
            <section className="flex flex-col items-center justify-center p-30">
                <h1 className="text-6xl font-sans">LabControl</h1>

                <div className="flex flex-col border rounded-2xl px-10 py-8 mt-10 ">

                    <div className="flex gap-20 text-3xl justify-center items-center w-100">
                        <a href="#" className="text-gray-100 bg-blue-200 px-6 py-3 rounded-2xl">Login</a>
                        <a href="#" className="text-gray-500">Cadastro</a>
                    </div>
                
                    <form action="" className="flex flex-col mt-10 gap-5">
                        <input type="email" placeholder="Digite seu email: " className="border-gray-300 border-solid border-2 rounded-lg py-2 pl-3"/>
                        <input type="password" placeholder="Insira sua senha: " className="border-gray-300 border-solid border-2 rounded-lg py-2"/>
                    </form> 

                    <a href="#">Esqueceu sua senha?</a>

                    <div>
                    <a href="#">Entrar</a>
                    </div>

                    <div>
                        <p>não possui cadastro? <a href="#">Clique aqui</a></p>
                    </div>
                 </div>
            </section>
        </main>
    );
}