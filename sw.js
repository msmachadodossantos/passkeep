/**
 * @file sw.js
 * @description Service worker configuration for caching essential application assets and enabling offline functionality.
 */

/**
 * Specifies the current cache version identifier.
 * Update this value to force a cache refresh when application assets change.
 * @constant {string}
 */
const CACHE_NAME = 'passkeep-cache-v1';

/**
 * Defines the list of core application URLs to store in the local cache.
 * @constant {string[]}
 */
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/**
 * Handles the service worker installation phase.
 * Opens the specified cache and adds all critical URLs required for offline usage.
 *
 * @param {ExtendableEvent} event - The installation lifecycle event.
 * @returns {void}
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened successfully.');
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * Intercepts outbound network requests and implements a cache-first strategy.
 * Returns the cached response if available; otherwise, falls back to the network.
 *
 * @param {FetchEvent} event - The fetch event containing the intercepted request.
 * @returns {void}
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

/**
 * Manages the service worker activation phase.
 * Iterates through all existing caches and deletes outdated versions to free up storage.
 *
 * @param {ExtendableEvent} event - The activation lifecycle event.
 * @returns {void}
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});