import { JSX } from "react/jsx-runtime";

type cardProps = {
  content?: Array<JSX.Element>;
}

export default function FormCard ({content}: cardProps) {
  return (
    <section className="flex flex-col rounded-2xl bg-white shadow-lg gap-10 lg:gap-20 lg:py-8 lg:px-20 px-10 py-3 items-center w-full max-w-150 h-full">
      {content}
    </section>
  );
}