import { categories } from "@/app/_data/storageData"

export function CatItem () {
  return (
    <section className="flex flex-col gap-1.5 w-full text-center mx-3">
      {categories.map((category, index) => <p key={index} className="hover:bg-blue-50 rounded-md">{category}</p>)}
    </section>
  )
}

export function ShowCat() {
  return (
    <section className="flex flex-col w-full my-1 items-center">
      <p className="font-semibold text-gray-500">categorias</p>
      <div className="flex my-2 w-full justify-center">
        <CatItem />
      </div>
    </section>
  )
}