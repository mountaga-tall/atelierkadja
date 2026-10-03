const CACHE = 'atelier-kadja-v16';

const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./script.js", "./manifest.json",
  "./fr/index.html", "./fr/manifest.json",
  "./en/index.html", "./en/manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/kadja-mark.png",
  "./404.html"
];

const isSameOrigin = request => new URL(request.url).origin === location.origin;
const isDocumentRequest = request =>
  request.destination === 'document' ||
  request.headers.get('accept')?.includes('text/html');

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // MP4 must keep native byte-range streaming. Never cache video/range requests.
  const isVideoRequest = request.destination === 'video' || request.headers.has('range');
  if (isVideoRequest) {
    event.respondWith(fetch(request));
    return;
  }

  // Code assets use stale-while-revalidate: cached code renders immediately,
  // while the network refreshes it in the background.
  const isCodeAsset = /\/(?:styles|script)\.js$/.test(new URL(request.url).pathname) ||
    /\/styles\.css$/.test(new URL(request.url).pathname);
  if (isCodeAsset) {
    event.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request, { cache: 'no-store' })
          .then(response => {
            if (response.ok && isSameOrigin(request)) {
              const copy = response.clone();
              caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
            }
            return response;
          })
          .catch(() => cached || Response.error());

        return cached || network;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && isSameOrigin(request)) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      }).catch(() => {
        // Never return HTML as a fallback for an image/video/other asset.
        return isDocumentRequest(request)
          ? caches.match('./404.html')
          : Response.error();
      });
    })
  );
});
