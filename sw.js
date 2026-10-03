const CACHE = 'atelier-kadja-v14';

const APP_SHELL = [
  "./", "./index.html", "./styles.css", "./script.js", "./localized-loader.js", "./manifest.json",
  "./fr/manifest.json", "./en/manifest.json",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/kadja-mark.png",
  "./index.html", "./nouveautes.html", "./chemises-tee-shirts-tops.html", "./tee-shirts.html", "./tops.html", "./robes.html", "./robes-volantes.html", "./lewa.html", "./fatila.html", "./robes-longues.html", "./ensembles.html", "./adire.html", "./assiri.html", "./anena.html", "./sawa-set.html", "./caftans.html", "./caftans-atypiques.html", "./caftans-brodes.html", "./pantalons.html", "./maillots-de-bain.html", "./sur-mesure.html", "./la-maison.html", "./contact.html", "./coming-soon.html", "./sitemap.html",
  "./fr/index.html", "./fr/nouveautes.html", "./fr/chemises-tee-shirts-tops.html", "./fr/tee-shirts.html", "./fr/tops.html", "./fr/robes.html", "./fr/robes-volantes.html", "./fr/lewa.html", "./fr/fatila.html", "./fr/robes-longues.html", "./fr/ensembles.html", "./fr/adire.html", "./fr/assiri.html", "./fr/anena.html", "./fr/sawa-set.html", "./fr/caftans.html", "./fr/caftans-atypiques.html", "./fr/caftans-brodes.html", "./fr/pantalons.html", "./fr/maillots-de-bain.html", "./fr/sur-mesure.html", "./fr/la-maison.html", "./fr/contact.html", "./fr/coming-soon.html", "./fr/sitemap.html",
  "./en/index.html", "./en/nouveautes.html", "./en/chemises-tee-shirts-tops.html", "./en/tee-shirts.html", "./en/tops.html", "./en/robes.html", "./en/robes-volantes.html", "./en/lewa.html", "./en/fatila.html", "./en/robes-longues.html", "./en/ensembles.html", "./en/adire.html", "./en/assiri.html", "./en/anena.html", "./en/sawa-set.html", "./en/caftans.html", "./en/caftans-atypiques.html", "./en/caftans-brodes.html", "./en/pantalons.html", "./en/maillots-de-bain.html", "./en/sur-mesure.html", "./en/la-maison.html", "./en/contact.html", "./en/coming-soon.html", "./en/sitemap.html",
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
