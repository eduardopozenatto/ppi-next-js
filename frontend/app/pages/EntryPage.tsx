import FormBody from '../components/UI/EntryPage/FormBody';
import Title from '../components/UI/General/Title';


export default function EntryPage() {
  return (
    <section className="flex justify-center items-center bg-linear-to-br from-white via-blue-100 to-blue-200 h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-evenly lg:max-w-400 w-full items-center gap-10 mx-10 h-fill">
        <Title />
        <FormBody />
      </div>
    </section>
  );
}