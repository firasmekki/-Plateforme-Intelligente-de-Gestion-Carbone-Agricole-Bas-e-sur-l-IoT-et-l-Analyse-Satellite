// Service Worker - auto-unregister pour forcer le rechargement des assets
self.addEventListener('install', () => {
  self.skipWaiting(); // active immédiatement sans attendre
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Vider tous les caches
    caches.keys()
      .then(names => Promise.all(names.map(name => caches.delete(name))))
      .then(() => {
        // Se désinstaller
        return self.registration.unregister();
      })
      .then(() => {
        // Forcer le rechargement de tous les onglets
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
  );
});
