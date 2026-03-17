// import FormBody from '../EntryPage/_components/FormBody';
import FormCard from '@/components/Body/FormCard';
import Title from '../EntryPage/_components/Title';
import { Header } from '../EntryPage/_components/Header';
import { setModeProps } from '@/components/Props/props';

export default function Recovery({mode, setMode}: setModeProps) {
  return (
      
  <section className="flex justify-center items-center bg-linear-to-br from-white via-blue-100 to-blue-200 h-screen">
    <div className="flex flex-col lg:flex-row lg:justify-evenly lg:max-w-400 w-full items-center gap-10 mx-10 h-fill">
      <Title></Title>
      <FormCard 
        content={[<Header mode={mode} setMode={setMode} key={0}/>, ]}
      />
    </div>
  </section>
  );
}