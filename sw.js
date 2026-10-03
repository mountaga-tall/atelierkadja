const CACHE = 'atelier-kadja-v12';

const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./styles.css?v=20260928-kadja-v10", "./script.js", "./script.js?v=20260928-kadja-v10", "./localized-loader.js", "./manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/kadja-mark.png",
  "./adire.html", "./anena.html", "./assiri.html", "./caftans-atypiques.html", "./caftans-brodes.html", "./caftans.html", "./chemises-tee-shirts-tops.html", "./coming-soon.html", "./contact.html", "./ensembles.html", "./fatila.html", "./index.html", "./la-maison.html", "./lewa.html", "./maillots-de-bain.html", "./nouveautes.html", "./pantalons.html", "./robes-longues.html", "./robes-volantes.html", "./robes.html", "./sawa-set.html", "./sitemap.html", "./sur-mesure.html", "./tee-shirts.html", "./tops.html",
  "./fr/adire.html", "./fr/anena.html", "./fr/assiri.html", "./fr/caftans-atypiques.html", "./fr/caftans-brodes.html", "./fr/caftans.html", "./fr/chemises-tee-shirts-tops.html", "./fr/coming-soon.html", "./fr/contact.html", "./fr/ensembles.html", "./fr/fatila.html", "./fr/index.html", "./fr/la-maison.html", "./fr/lewa.html", "./fr/maillots-de-bain.html", "./fr/nouveautes.html", "./fr/pantalons.html", "./fr/robes-longues.html", "./fr/robes-volantes.html", "./fr/robes.html", "./fr/sawa-set.html", "./fr/sitemap.html", "./fr/sur-mesure.html", "./fr/tee-shirts.html", "./fr/tops.html",
  "./en/adire.html", "./en/anena.html", "./en/assiri.html", "./en/caftans-atypiques.html", "./en/caftans-brodes.html", "./en/caftans.html", "./en/chemises-tee-shirts-tops.html", "./en/coming-soon.html", "./en/contact.html", "./en/ensembles.html", "./en/fatila.html", "./en/index.html", "./en/la-maison.html", "./en/lewa.html", "./en/maillots-de-bain.html", "./en/nouveautes.html", "./en/pantalons.html", "./en/robes-longues.html", "./en/robes-volantes.html", "./en/robes.html", "./en/sawa-set.html", "./en/sitemap.html", "./en/sur-mesure.html", "./en/tee-shirts.html", "./en/tops.html"
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

  // CSS/JS are fetched fresh so a deployment cannot leave the previous
  // version stuck behind the browser HTTP cache.
  const isCodeAsset = /\/(?:styles|script)\.js$/.test(new URL(request.url).pathname) ||
    /\/styles\.css$/.test(new URL(request.url).pathname);
  if (isCodeAsset) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response.ok && isSameOrigin(request)) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || Response.error()))
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
          ? caches.match('./index.html')
          : Response.error();
      });
    })
  );
});
