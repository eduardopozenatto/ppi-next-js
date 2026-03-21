import { itemsData } from "@/app/_data/itemsData";
import Image from "next/image";
import { SmallButtonLink, ButtonLink } from "@/components/Button/Link";

export default function Items() {
  return (
    <section className="grid lg:grid-cols-4 text-justify gap-10">
    {Object.entries(itemsData).map(([key, item]) => (
      <div key={key} className="flex items-center min-w-[400px] gap-10 p-4 border-2 border-gray-300 rounded-lg">
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-end"> 
            <SmallButtonLink content="Disponível" />
          </div>
          <div>
            <p className="text-md font-semibold text-gray-500">{item.name}</p>
            <p className="text-sm text-gray-400 font-semibold">{item.category}</p>
          </div>

          <div>
            <p>{item.description}</p>
          </div>

        </div>

        <div>
          <Image src={item.image} width={300} height={300} alt="icon"/>
        </div>
      </div>
    ))}
    </section>
  )
}