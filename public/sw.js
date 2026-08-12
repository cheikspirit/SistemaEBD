// Service Worker para PWA
const CACHE_NAME = 'ebd-digital-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Passa requisições de desenvolvimento e rotas para a rede sem interceptar
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/_next') || url.pathname.includes('webpack')) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

