const CACHE_NAME = 'responderx-cache-v1';
const urlsToCache = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/volunteer_dashboard',
  '/submit_report',
  '/reports',
  '/view_report',
  '/admin',
  '/ration_management',
  '/register_volunteer',
  '/all_volunteers',
  '/contact',
  '/chat',
  '/resources',
  '/donate',
  '/donate/money',
  '/donate/resources',
  '/view_donations',
  '/view_resources',
  '/logout',
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});