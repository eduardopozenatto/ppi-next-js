import Title from "../components/General/Title";
import FormBody from "../components/EntryPage/FormBody";

export default function ForgotPassword () {
  return (
    <section className="flex justify-center items-center bg-linear-to-br from-white via-blue-100 to-blue-200 h-screen">
          <div className="flex flex-col lg:flex-row lg:justify-evenly lg:max-w-400 w-full items-center gap-10 mx-10 h-fill">
            <Title />
            <FormBody />
          </div>
        </section>
    
  )
}