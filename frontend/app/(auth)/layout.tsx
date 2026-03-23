import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { ToastProvider } from "@/components/shared/Toast";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <AppShell>
        <ToastProvider>{children}</ToastProvider>
      </AppShell>
    </AuthGate>
  );
}
