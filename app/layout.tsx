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
        <link rel="manifest" href="/manifest.json?v=3" />
        <link rel="icon" href="https://res.cloudinary.com/dryqi1mtn/image/upload/v1715494632/logo_ebd_pomba_f7z7z8.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dryqi1mtn/image/upload/v1715494632/logo_ebd_pomba_f7z7z8.png" />
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
