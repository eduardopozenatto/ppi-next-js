import { Suspense } from "react";
import { NewLoanForm } from "@/components/loans/NewLoanForm";
import { PageHeader } from "@/components/shared/PageHeader";

function FormFallback() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8 text-center text-sm text-[var(--color-text-subtle)]">
      A carregar formulário…
    </div>
  );
}

export default function NewLoanPage() {
  return (
    <div>
      <PageHeader
        title="Novo empréstimo"
        description="Preencha os dados do solicitante e do material. Integração com API em breve."
      />
      <Suspense fallback={<FormFallback />}>
        <NewLoanForm />
      </Suspense>
    </div>
  );
}
