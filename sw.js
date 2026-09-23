/* Tiv Downloader — Service Worker */
const CACHE_NAME = 'tiv-v12';

const ASSETS = [
  './',
  './index.html',
  './tools.html',
  './tools-Baru.html',
  './games.html',
  './manifest.json',
  './lib/marked.min.js',
  './lib/qrcode.min.js',
  './lib/pdf-lib.min.js',
  './lib/pdf.min.js',
  './lib/pdf.worker.min.js',
  './lib/ffmpeg.min.js',
  './lib/ffmpeg-core.js',
  './lib/ffmpeg-core.wasm', 
  "./assets/Dev.png', 
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Jangan cache API TikTok
  if (url.hostname.includes('tikwm') || url.hostname.includes('tiktok')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone).catch(() => {}));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
