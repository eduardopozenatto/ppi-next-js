import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/layout/AuthGate";
import { CartProvider } from "@/contexts/CartContext";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <CartProvider>
        <AppShell>{children}</AppShell>
      </CartProvider>
    </AuthGate>
  );
}
