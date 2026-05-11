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
      <head>
        <link rel="manifest" href="/manifest.json?v=2" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/ebd-digital/512/512" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EBD Digital" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
