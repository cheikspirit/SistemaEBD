import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EBD Digital',
  description: 'Plataforma para Gestão da Escola Bíblica Dominical',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json?v=10" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EBD Digital" />
        <meta name="mobile-web-app-capable" content="yes" />
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
