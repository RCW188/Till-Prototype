/*
 * The Cashier System — app-shell service worker.
 * Keeps the till loadable with no network connection at all: the shell is
 * cached on install, served cache-first, and refreshed in the background
 * whenever a connection is available. All business data itself lives in
 * localStorage on the device, never here — this file only makes sure the
 * app can still be *opened* offline (e.g. after a full page reload).
 */
const CACHE_NAME = 'cashier-system-shell-v1';
const SHELL_FILES = [
  './',
  './till_1.html',
  './index.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .catch(() => { /* best-effort — a partial cache still helps */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
