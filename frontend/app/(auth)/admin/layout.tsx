import type { ReactNode } from "react";
import { AdminGate } from "@/components/layout/AdminGate";

export default function AdminSectionLayout({ children }: { children: ReactNode }) {
  return <AdminGate>{children}</AdminGate>;
}
