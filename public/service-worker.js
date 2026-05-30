const CACHE_NAME = 'agrocarbon-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Installation - mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.log('Erreur cache:', err);
      })
  );
  self.skipWaiting();
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - stratégie cache-first pour les ressources statiques
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes API (pas de cache)
  if (event.request.url.includes('/api/') || event.request.url.includes(':3001')) {
    return;
  }

  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner depuis le cache si disponible
        if (response) {
          return response;
        }

        // Sinon faire la requête réseau
        return fetch(event.request)
          .then((networkResponse) => {
            // Ne pas cacher les réponses non-valide
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Si offline et pas en cache, retourner page offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
