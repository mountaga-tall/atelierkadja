const CACHE = 'atelier-kadja-v6';

const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./script.js", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png",
  "./adire.html", "./anena.html", "./assiri.html", "./caftans-atypiques.html",
  "./caftans-brodes.html", "./caftans.html", "./chemises-tee-shirts-tops.html",
  "./coming-soon.html", "./contact.html", "./ensembles.html", "./fatila.html",
  "./la-maison.html", "./lewa.html", "./maillots-de-bain.html", "./nouveautes.html",
  "./pantalons.html", "./robes-longues.html", "./robes-volantes.html", "./robes.html",
  "./sawa-set.html", "./sitemap.html", "./sur-mesure.html", "./tee-shirts.html",
  "./tops.html"
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
          ? caches.match('./index.html')
          : Response.error();
      });
    })
  );
});
