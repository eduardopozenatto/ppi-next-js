import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight text-[var(--color-text)]">LabControl</span>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg)] px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
              O laboratório organizado,{" "}
              <span className="text-[var(--color-primary)]">do estoque ao empréstimo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-[var(--color-text-subtle)] sm:text-xl">
              Controle de materiais, pedidos de alunos e aprovações numa interface pensada para equipas
              académicas — responsiva e pronta para integrar com a tua API.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-azure-500/20 transition-transform active:scale-[0.99] sm:w-auto sm:min-w-[11rem]"
              >
                Começar agora
              </Link>
              <Link
                href="/login"
                className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-8 py-3.5 text-center text-base font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-subtle)] sm:w-auto sm:min-w-[11rem]"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="text-center text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Funcionalidades principais
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--color-text-subtle)]">
            O mesmo fluxo descrito para o micro-SaaS LabControl: estoque, empréstimos e área de
            laboratorista.
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Catálogo e pedidos",
                body: "Alunos pesquisam itens, veem disponibilidade e iniciam pedidos de empréstimo.",
              },
              {
                title: "Gestão de estoque",
                body: "Quantidades totais, disponíveis e emprestadas, com fichas detalhadas por item.",
              },
              {
                title: "Painel do laboratório",
                body: "Aprovações, utilizadores, relatórios e configurações para quem gere o espaço.",
              },
            ].map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-subtle)]">{card.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-8 text-center text-sm text-[var(--color-text-subtle)] sm:px-6">
        <p>LabControl — software open source para laboratórios de informática.</p>
      </footer>
    </div>
  );
}
