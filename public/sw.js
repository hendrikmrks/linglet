const CACHE_NAME = 'linglet-v1';

// Assets to pre-cache (app shell)
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
];

// Install – pre-cache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
});

// Activate – clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - API calls → Network only (never cache)
// - Navigation (HTML) → Network first, fallback /dashboard
// - Static assets (_next/static) → Cache first
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // API → network only
  if (url.pathname.startsWith('/api/')) return;

  // Static assets → cache first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
      )
    );
    return;
  }

  // HTML navigation → network first, fallback to cached /dashboard
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/dashboard').then((res) => res || caches.match('/'))
      )
    );
    return;
  }
});
