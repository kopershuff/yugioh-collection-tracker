const CACHE_NAME = 'yugioh-checklist-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Installation du service worker
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  (self as any).skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  (self as any).clients.claim();
});

// Stratégie de cache : Network First avec fallback sur le cache
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cloner la réponse
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

export {};
