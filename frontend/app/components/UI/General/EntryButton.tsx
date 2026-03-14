import { SmButtonLink } from "./Link";
import { Link } from "./Link";

export default function EntryButton () {
  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content="Entrar" />
      <div>
        <p>
          Não possui cadastro? <Link content="clique aqui" />
        </p>
      </div>
    </div>
  );
};