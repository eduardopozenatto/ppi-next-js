import type { Metadata } from "next";
import "./src/globals.css";
import { Poppins } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LabControl",
    template: "%s · LabControl",
  },
  description: "Gestão de estoque e empréstimos para laboratórios de informática.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={poppins.variable}>
      <body className={poppins.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
