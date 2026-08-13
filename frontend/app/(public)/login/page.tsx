import { AuthFormBody } from "@/components/auth/FormBody";
import { AuthHeroTitle } from "@/components/auth/Title";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center bg-[var(--color-bg)] px-4 py-8 sm:px-6 md:py-12">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle compact />
      </div>
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <AuthHeroTitle />
        <div className="flex w-full justify-center lg:justify-end">
          <AuthFormBody />
        </div>
      </div>
    </main>
  );
}
