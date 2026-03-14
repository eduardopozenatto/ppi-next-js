import LoginForm from "./LoginForm";
import EntryButton from "../General/EntryButton";
import LoginHeader from "./LoginHeader";
import FormCard from "../General/FormCard";

function UpperLogin () {
  return (
    <div className="flex flex-col gap-10 w-full h-full">
        <LoginHeader />
        <LoginForm />
      </div>
  )
}

export default function LoginBody () {
  return (
    <>
    <FormCard content={[<UpperLogin key={0}/>, <EntryButton key={1}/>]} />
    </>
  );
}