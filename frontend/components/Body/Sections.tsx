import ButtonSection from "../Button/ButtonSection";
import { userData } from "@/app/_data/userData";

function IsAdmin() {
  return userData.tag === 'laboratorista';

}

export default function Sections() {
  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col gap-10 ml-4">
        <div className="flex flex-col gap-3">
          {userData.userPermissions.verItens && <ButtonSection type="items"/>}
          {userData.userPermissions.pedirEmprestimos && <ButtonSection type="loans"/>}
          {userData.userPermissions.VerNotificacoes && <ButtonSection type="notifications"/>}
          {userData.userPermissions.VerEstoque && <ButtonSection type="storage"/>}
        </div>

        { IsAdmin() &&
          (<div className="flex flex-col gap-3">
            <p className="font-black">Administração</p>
            {userData.userPermissions.AprovEmprestimos && <ButtonSection type="aprovations"/>}
            {userData.userPermissions.GerenciarUsuarios && <ButtonSection type="users"/>}
            {userData.userPermissions.GerarRelatorios && <ButtonSection type="reports"/>}
          
          </div>)
      }

      </div>

      <div className="flex flex-col">
        <hr className="w-[80%] self-center text-gray-400"></hr>
        <div className="mb-20 ml-4">
          <ButtonSection type="config"/>
          <ButtonSection type="carshop"/>
        </div>
      </div>
    
    </div>
  )
}