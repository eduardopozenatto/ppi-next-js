import { RecoveryForm } from "@/components/auth/RecoveryForm";
import { AuthHeroTitle } from "@/components/auth/Title";

export default function RecoveryPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-[var(--color-bg)] via-azure-50 to-azure-200 px-4 py-10 sm:px-8">
      <section className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16">
        <AuthHeroTitle />
        <RecoveryForm />
      </section>
    </main>
  );
}
