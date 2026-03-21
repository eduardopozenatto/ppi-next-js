import { SmallButtonLink } from "@/components/Button/Link";
import { SmallLink } from "@/components/Link/Link";
import { Mode } from "../../types";

type EntryButtonProps = {
  mode?: Mode;
  setMode?: (mode: Mode) => void;
};

export default function EntryButton({ mode = 'login', setMode = () => {} }: EntryButtonProps) {
  const contentValue = {
    login: 'Não possui cadastro?',
    register: 'Já possui cadastro?',
    recovery: 'Sabe a senha?',
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 mb-4 w-full">
      <SmallButtonLink content={mode === 'recovery' ? 'Enviar' : 'Entrar'} />
      <div className="text-sm text-gray-600 flex items-center gap-1 mt-2">
        <span>{contentValue[mode]}</span>
        <SmallLink 
          content="Clique aqui" 
          onClick={toggleMode} 
        />
      </div>
    </div>
  );
};