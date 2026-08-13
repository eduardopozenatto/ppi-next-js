import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { ToastProvider } from "@/components/shared/Toast";
import { CartProvider } from "@/contexts/CartContext";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <CartProvider>
        <AppShell>
          <ToastProvider>{children}</ToastProvider>
        </AppShell>
      </CartProvider>
    </AuthGate>
  );
}
