import { SmButtonLink } from "../../../components/Button/Button";
import { SmLink } from "../../../components/Link/Link";

import { modeProps } from "../../../components/Props/props";

export default function EntryButton ({mode}: modeProps){
  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content="Entrar" />
      <div>
        <p>
          {
           mode == 'login' ? (
            <>
              Não possui cadastro? {<SmLink content="Clique aqui"/>}
            </>
          ) : (
            <>
           Já possui cadastro? {<SmLink content="Clique aqui" />}
            </>
          )}

        </p>
      </div>
    </div>
  );
};