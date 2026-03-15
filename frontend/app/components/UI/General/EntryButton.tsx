import { Dispatch, SetStateAction } from "react";
import { SmButtonLink } from "./Link";
import { Link } from "./Link";

interface EntryButtonProps {
  isLogin: boolean
}

export default function EntryButton ({isLogin}: EntryButtonProps){
  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content="Entrar" />
      <div>
        <p>
          {
           isLogin ? (
            <>
              Não possui cadastro? {<Link content="Clique aqui"/>}
            </>
          ) : (
            <>
           Já possui cadastro? {<Link content="Clique aqui" />}
            </>
          )}

        </p>
      </div>
    </div>
  );
};