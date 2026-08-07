/*
 * The Cashier System — app-shell service worker.
 * Keeps the till loadable with no network connection at all: the shell is
 * cached on install and kept fresh in the cache on every successful fetch.
 * All business data itself lives in localStorage on the device, never here —
 * this file only makes sure the app can still be *opened* offline (e.g.
 * after a full page reload) and that online visitors always see the latest
 * deploy rather than a stale cached copy.
 *
 * CACHE_NAME must change whenever this file changes — that's what makes an
 * already-installed service worker notice an update is available at all and
 * cycle in the new cache. Bump the version suffix on every deploy that must
 * force-refresh clients.
 */
const CACHE_NAME = 'cashier-system-shell-v3';
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
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isAppShellPage = event.request.mode === 'navigate' || event.request.destination === 'document';

  if (isAppShellPage) {
    // Network-first for the till itself: an online visitor always gets whatever
    // was just deployed. Only when the network is unreachable do we fall back
    // to whatever shell we last cached, so the app still opens offline.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match('./till_1.html'))
        )
    );
    return;
  }

  // Everything else (icons, manifest, etc.) changes rarely — cache-first with
  // a background revalidation keeps those instant without risking staleness
  // on the one file that actually matters, the app shell itself.
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
