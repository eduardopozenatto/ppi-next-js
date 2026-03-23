import { AuthFormBody } from "@/components/auth/FormBody";
import { AuthHeroTitle } from "@/components/auth/Title";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-[var(--color-bg)] via-azure-50 to-azure-100 px-4 py-8 sm:px-6 md:py-12">
      <section className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <AuthHeroTitle />
        <AuthFormBody initialMode="login" />
      </section>
    </main>
  );
}
