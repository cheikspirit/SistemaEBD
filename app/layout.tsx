import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EBD Digital",
  description: "Gestão de Escola Bíblica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}
