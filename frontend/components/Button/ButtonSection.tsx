import { twMerge } from "tailwind-merge";
import Image from "next/image";

type ButtonSectionProps = {
  type?: keyof typeof typeList,
  className?: string,
  src?: string,
}

const typeList = {
  items: {
    content: "Buscar itens",
    src: '/buttonIcons/search.svg',
  },
  loans: {
    content: "Empréstimos",
    src: '/buttonIcons/calendar.svg',
  },
  notifications: {
    content: "Notificações",
    src: '/buttonIcons/bell.svg',
  },
  storage: {
    content: "Estoque",
    src: '/buttonIcons/box.svg',
  },
  aprovations: {
    content: "Aprovações",
    src: '/buttonIcons/aprovation.svg',
  },
  users: {
    content: "Usuários",
    src: '/buttonIcons/users.svg',
  },
  reports: {
    content: "Relatórios",
    src: '/buttonIcons/reports.svg',
  },
  config: {
    content: "Configurações",
    src: '/buttonIcons/settings.svg',
  },
  carshop: {
    content: "Carrinho",
    src: '/buttonIcons/carshop.svg',
  },
};

export default function ButtonSection ({type, className}: ButtonSectionProps) {
  const item = type ? typeList[type] : null;
  const content = item?.content || "";

  return (
    <div className="hover:bg-blue-100 px-3 rounded-lg justify-center items-center w-fit">
      <div className="flex flex-row w-fit">
        {item && (
          <Image src={item.src} alt="Icon" width={20} height={10}/>
        )}
        <p className={twMerge("text-gray-600 hover:text-black rounded-lg w-fit pl-2 py-2", className)}>{content}</p>
      </div>
    </div>
  )
}