import LoginForm from "./LoginForm";
import EntryButton from "./LoginEntryButton";
import LoginHeader from "./LoginHeader";

export default function LoginBody () {
  return (
    <section className="flex flex-col rounded-2xl bg-white shadow-lg gap-10 lg:gap-20 lg:py-8 lg:px-20 px-10 py-3 items-center w-full max-w-[600px] h-full">
      <div className="flex flex-col gap-10 w-full h-full">
        <LoginHeader></LoginHeader>
        <LoginForm></LoginForm>
      </div>
      <EntryButton></EntryButton>
    </section>
  );
}