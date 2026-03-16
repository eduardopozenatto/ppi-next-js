import { SmButtonLink } from "./Link";
import { Link } from "./Link";

import { modeProps } from "@/app/_props/props";

export default function EntryButton ({mode}: modeProps){
  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content="Entrar" />
      <div>
        <p>
          {
           mode == 'login' ? (
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