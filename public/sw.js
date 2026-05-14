const CACHE_NAME = 'indocreonix-v3';
const OFFLINE_ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (!isSameOrigin) {
    return;
  }

  const isNavigation = request.mode === 'navigate' || request.destination === 'document';

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone)).catch(() => {
            // Best-effort cache write.
          });
        }

        return networkResponse;
      } catch {
        if (isNavigation) {
          const appShell = await caches.match('/index.html');
          if (appShell) {
            return appShell;
          }
        }

        // Return a valid Response to avoid "Failed to convert value to 'Response'".
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })()
  );
});
