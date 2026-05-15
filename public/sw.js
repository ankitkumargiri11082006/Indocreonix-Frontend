const CACHE_NAME = 'indocreonix-v4';
const OFFLINE_ASSETS = ['/index.html', '/manifest.webmanifest', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(
        OFFLINE_ASSETS.map((url) => new Request(url, { cache: 'reload' }))
      )
    )
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
      // Navigation (HTML) should be network-first to avoid serving stale index.html
      // that references missing hashed chunks after a deployment.
      if (isNavigation) {
        try {
          const networkResponse = await fetch(request);
          const contentType = networkResponse?.headers?.get('content-type') || '';

          if (networkResponse && networkResponse.ok && contentType.includes('text/html')) {
            const responseClone = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put('/index.html', responseClone))
              .catch(() => {
                // Best-effort cache write.
              });
            return networkResponse;
          }

          // If the host returns a non-HTML response or an error, fall back to app shell.
          const appShell = await caches.match('/index.html');
          return appShell || networkResponse;
        } catch {
          const appShell = await caches.match('/index.html');
          if (appShell) {
            return appShell;
          }
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      }

      // Other assets: cache-first.
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone))
            .catch(() => {
              // Best-effort cache write.
            });
        }

        return networkResponse;
      } catch {
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event?.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
