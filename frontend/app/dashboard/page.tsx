import Sections from "@/components/Body/Sections";
import Slogan from "../../components/Body/Slogan";
import Storage from "./storage/storage";

export default function Home() {
  return (
    <section className="h-screen grid grid-cols-[minmax(250px,1fr)_10fr]">
      <div className="flex flex-col gap-2 bg-blue-50 rounded-r-4xl">
        <Slogan />
        <hr className="w-[80%] self-center text-gray-400"></hr>
        <Sections />
        
      </div>
      <Storage />
    </section>
  )
}