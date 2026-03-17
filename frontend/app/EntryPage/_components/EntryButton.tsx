import { SmButtonLink } from "../../../components/Button/Button";
import { SmLink } from "../../../components/Link/Link";

import { setModeProps } from "../../../components/Props/props";

export default function EntryButton ({mode, setMode}:setModeProps) {

const contentValue = {
    login: 'Não possui cadastro? ',
    register: 'Já possui cadastro? ',
    recovery: 'Sabe a senha? ',

  }
  
  const verifyMode = () => {
    return mode == 'login' ? setMode('register') : setMode('login');
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content={mode == 'recovery' ? "Enviar" : "Entrar"} />
      <div>
        <p>
          {<> {contentValue[mode]} {<SmLink content="Clique aqui" onClick={verifyMode}/>} </>}

        </p>
      </div>
    </div>
  );
};