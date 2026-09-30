/* Service worker — offline support.
   IMPORTANT: bump CACHE_VERSION on every deploy that changes assets,
   together with the ?v=N cache-busters in index.html. */
var CACHE_VERSION = 'v1';
var CACHE_NAME = 'espanol-' + CACHE_VERSION;

var SHELL = [
  './',
  'index.html',
  'style.css?v=1',
  'app.js?v=1',
  'data.js?v=1',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Firebase SDK scripts are runtime-cached; Firebase *data* (firebaseio.com)
// never is — the app falls back to localStorage on its own.
var RUNTIME_HOSTS = ['www.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function (c) { return c.addAll(SHELL); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      if (k.indexOf('espanol-') === 0 && k !== CACHE_NAME) return caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Navigations: network-first so updates arrive, cached page offline.
  // Keyed by URL, so the exam page (examen/) never replaces the app shell.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); });
    }));
    return;
  }

  // Same-origin assets: cache-first (immutable thanks to ?v=N).
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
        return res;
      });
    }));
    return;
  }

  if (RUNTIME_HOSTS.indexOf(url.hostname) !== -1) {
    e.respondWith(caches.match(req).then(function (hit) {
      var refresh = fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return hit; });
      return hit || refresh;
    }));
  }
});
