import ButtonSection from "../Button/ButtonSection";
import { userData } from "@/app/_data/userData";
import Image from "next/image";

function IsAdmin() {
  return userData.tag.name === 'laboratorista';

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
        <div className="flex flex-col gap-2">
          <hr className="w-[80%] self-center text-gray-400"></hr>
          <div className=" ml-4 mb-10">
            <ButtonSection type="config" className="self-center"/>
            <ButtonSection type="carshop"/>
          </div>
          <div>
        </div>
        
        <div className="flex flex-col mb-5 justify-center hover:bg-blue-100 rounded-2xl items-center mx-7">
        
          <div className="flex items-center gap-2 mr-4">
            <div className="flex items-center hover:bg-blue-200 p-2 py-3 rounded-lg">
              <Image 
              src='/buttonIcons/exit-account.svg'
              alt="icon"
              width={25}
              height={25}
              />
            </div>

            <div className="">
              <ButtonSection type="user" className="hover:text-gray-500"/>
              <p className={userData.tag.color}>{userData.tag.name}</p>
            </div>
          </div>
        </div>
      </div>
    
      </div>

      
    </div>
  )
}