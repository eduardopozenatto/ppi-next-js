import { ButtonLink } from "../General/Link";

export default function LoginHeader() {
  return (
    <div className="flex justify-evenly gap-5 mt-5 self-center w-full">
      <ButtonLink content="Login" className="w-auto text-center"></ButtonLink>

      <ButtonLink
        content="Cadastre-se"
        className="bg-white text-gray-500 hidden md:inline"
      ></ButtonLink>
    </div>
  );
}
