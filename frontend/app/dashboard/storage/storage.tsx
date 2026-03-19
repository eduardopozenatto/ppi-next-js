import SearchTab from "./_components/search";
import Items from "./_components/items";

export default function Storage() {
  return (
    <section className="">
      <div className="flex flex-col gap-5 mx-10 mt-10">
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl text-gray-700 font-bold">Buscar itens</h3>
          <p className="text-xl text-gray-500 font-semibold">Encontre e solicite itens no laboratório</p>
        </div>

        <SearchTab></SearchTab>
        <div>
          <Items />
        </div>
      </div>

      

    </section>
  )
}