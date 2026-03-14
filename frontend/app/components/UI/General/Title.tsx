export default function LoginTitle () {
  return (
      <section className="flex flex-col w-fit justify-center items-center lg:self-start lg:mt-25 max-h-[500px]">
        <div className="flex-wrap ">
          <h1 className="text-5xl lg:text-8xl bg-[linear-gradient()] font-semibold flex-wrap">
            Lab Control
          </h1>
        </div>

        <div className="px-[20px] md:px-0">
          <p className="text-center text-blue-800 lg:text-xl">
            <em>O sistema de gerenciamento que te deixa no controle.</em>
          </p>
        </div>
      </section>
    );
}