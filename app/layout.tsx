import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EBD Digital",
  description: "Gestão de Escola Bíblica",
  manifest: "/manifest.json?v=3",
  icons: {
    icon: "https://res.cloudinary.com/dryqi1mtn/image/upload/v1715494632/logo_ebd_pomba_f7z7z8.png",
    apple: "https://res.cloudinary.com/dryqi1mtn/image/upload/v1715494632/logo_ebd_pomba_f7z7z8.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "EBD Digital",
  }
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
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
