export function AuthHeroTitle() {
  return (
    <section className="flex w-full max-w-xl flex-col items-center gap-4 self-center text-center lg:items-start lg:self-start lg:text-left">
      <h1 className="bg-gradient-to-br from-azure-700 via-azure-600 to-azure-500 bg-clip-text text-4xl font-semibold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-7xl xl:text-8xl">
        LabControl
      </h1>
      <p className="max-w-md text-balance text-base text-[var(--color-text)] sm:text-lg lg:text-xl">
        <em>Gestão de estoque e empréstimos do laboratório, num só lugar.</em>
      </p>
    </section>
  );
}
