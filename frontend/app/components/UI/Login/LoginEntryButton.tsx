import { SmButtonLink } from "../General/Link";
import { Link } from "../General/Link";

export default function EntryButton () {
  return (
    <div className="flex flex-col items-center gap-3 mt-10 mb-3">
      <SmButtonLink content="Entrar"></SmButtonLink>
      <div>
        <p>
          Não possui cadastro? <Link content="clique aqui"></Link>
        </p>
      </div>
    </div>
  );
};