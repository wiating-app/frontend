/// <reference lib="webworker" />
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

// TypeScript declarations for Workbox
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any
}

precacheAndRoute(self.__WB_MANIFEST)

// Cache OpenStreetMap tiles for offline use
// Using StaleWhileRevalidate: serves cached tiles immediately while fetching fresh ones in background
/*
registerRoute(
  ({ url }) => url.origin === 'https://tile.openstreetmap.org',
  new StaleWhileRevalidate({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache successful responses and opaque responses (for CORS)
      }),
      new ExpirationPlugin({
        maxEntries: 4000, // Maximum number of tiles to cache
        maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
        purgeOnQuotaError: true, // Automatically purge if storage quota is exceeded
      }),
    ],
  }),
)
*/

// Alternative: CacheFirst strategy (better for offline, but tiles may be stale)
// Uncomment this and comment out the StaleWhileRevalidate above if you prefer offline-first
registerRoute(
  ({ url }) => url.origin === 'https://tile.openstreetmap.org',
  new CacheFirst({
    cacheName: 'osm-tiles',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 4000,
        maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
)

// Handle messages from the registration script
self.addEventListener('message', event => {
  // eslint-disable-next-line no-console
  console.log('[SW] Received message:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    // eslint-disable-next-line no-console
    console.log('[SW] Received SKIP_WAITING message - calling skipWaiting()')
    self.skipWaiting()
  }
})
