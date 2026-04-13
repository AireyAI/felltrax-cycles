/**
 * Felltrax Cycles — Service Worker
 * Caches static assets for offline support and faster loads.
 */
var CACHE_NAME = 'felltrax-v2';
var ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/trails.html',
  '/booking.html',
  '/product.html',
  '/blog.html',
  '/events.html',
  '/404.html',
  '/css/styles.css',
  '/js/includes.js',
  '/js/theme.js',
  '/js/nav.js',
  '/js/ui-extras.js',
  '/animations.js',
  '/components/nav.html',
  '/components/footer.html',
  '/data/bikes.json',
  '/data/trails.json',
  '/manifest.json'
];

// Install — cache core assets
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', function (e) {
  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Skip external requests
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request).then(function (response) {
      // Cache successful responses
      if (response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function () {
      return caches.match(e.request).then(function (cached) {
        return cached || caches.match('/404.html');
      });
    })
  );
});
