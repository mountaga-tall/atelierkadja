const CACHE = 'atelier-kadja-v5';
const APP_SHELL = ["./", "./styles.css", "./script.js", "./manifest.json", "./adire.html", "./anena.html", "./assiri.html", "./caftans-atypiques.html", "./caftans-brodes.html", "./caftans.html", "./chemises-tee-shirts-tops.html", "./coming-soon.html", "./contact.html", "./ensembles.html", "./fatila.html", "./index.html", "./la-maison.html", "./lewa.html", "./maillots-de-bain.html", "./nouveautes.html", "./pantalons.html", "./robes-volantes.html", "./robes.html", "./sawa-set.html", "./sitemap.html", "./sur-mesure.html", "./tee-shirts.html", "./tops.html"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      if (new URL(req.url).origin === location.origin) caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
