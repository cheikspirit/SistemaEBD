import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'EBD Digital',
  description: 'Plataforma para Gestão da Escola Bíblica Dominical',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EBD Digital',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW PWA registrado com sucesso:', reg.scope); },
                    function(err) { console.warn('Falha ao registrar SW PWA:', err); }
                  );
                });
              }
              window.addEventListener('error', function(e) {
                if (e && e.message && e.message.indexOf('Loading chunk') !== -1) {
                  var lastReload = sessionStorage.getItem('chunk_reload');
                  if (!lastReload || Date.now() - parseInt(lastReload, 10) > 10000) {
                    sessionStorage.setItem('chunk_reload', Date.now().toString());
                    window.location.reload();
                  }
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
