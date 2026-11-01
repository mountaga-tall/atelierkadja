'use strict';

const CACHE = 'atelier-kadja-v37-20261101-install-guard';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './localized-loader.js',
  './manifest.json',
  './fr/index.html',
  './fr/manifest.json',
  './en/index.html',
  './en/manifest.json',
  './fr/nouveautes.html',
  './en/nouveautes.html',
  './fr/blazers.html',
  './en/blazers.html',
  './fr/contact.html',
  './en/contact.html',
  './fr/la-maison.html',
  './en/la-maison.html',
  './fr/sur-mesure.html',
  './en/sur-mesure.html',
  './images/NOUVEAUTÉS/cassmarper.webp',
  './icons/icon-192.png',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-512.png',
  './icons/kadja-mark.png',
  './404.html'
];

const isSameOrigin = request => new URL(request.url).origin === self.location.origin;
const isDocumentRequest = request =>
  request.mode === 'navigate' ||
  request.destination === 'document' ||
  request.headers.get('accept')?.includes('text/html');

const canonicalRequestUrl = request => {
  const url = new URL(request.url);
  url.search = '';
  url.hash = '';
  return url.href;
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // One missing optional shell asset must not cancel the entire installation.
    await Promise.allSettled(APP_SHELL.map(async path => {
      const url = new URL(path, self.registration.scope).href;
      const response = await fetch(url, { cache: 'reload' });
      if (!response.ok) throw new Error('Unable to cache ' + url);
      await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith('atelier-kadja-') && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !isSameOrigin(request)) return;

  // Preserve native streaming and byte-range support for MP4/video.
  if (request.destination === 'video' || request.headers.has('range')) {
    event.respondWith(fetch(request));
    return;
  }

  if (isDocumentRequest(request)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(canonicalRequestUrl(request), response.clone());
        }
        return response;
      } catch (_) {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        return (await caches.match(new URL('./404.html', self.registration.scope).href)) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(canonicalRequestUrl(request), response.clone());
      }
      return response;
    } catch (_) {
      return Response.error();
    }
  })());
});
