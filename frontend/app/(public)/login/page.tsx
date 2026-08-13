import { AuthFormBody } from "@/components/auth/FormBody";
import { AuthHeroTitle } from "@/components/auth/Title";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-[var(--color-bg)] via-azure-50 to-azure-100 px-4 py-8 sm:px-6 md:py-12">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <AuthHeroTitle />
        <div className="flex w-full justify-center lg:justify-end">
          <AuthFormBody />
        </div>
      </div>
    </main>
  );
}
