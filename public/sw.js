/**
 * Service Worker for MIN Singkawang PWA Portal
 * Supports caching assets, offline fallbacks, and stale-while-revalidate mechanism.
 */

const CACHE_NAME = 'min-singkawang-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Clear older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event: Cache Interceptor with intelligent strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Exclude non-http/https protocols (like chrome-extension, chrome devtools, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle HTML documents or navigation path with Network First approach
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and put in cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, serve from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If offline and not in cache, let the SPA index page load
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Handle Static files (JS, CSS, Font files, assets, standard images) with Stale-while-revalidate approach
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (Stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch((err) => console.log('Background fetch failed: ', err));

        return cachedResponse;
      }

      // If not in cache, fallback to normal network fetch
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback or silence for image tags if no network
        if (request.destination === 'image') {
          // Return placeholder or let it fail gracefully
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="#f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">Offline - Gambar Khas</text></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
      });
    })
  );
});
