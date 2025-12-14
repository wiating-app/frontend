/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

// TypeScript declarations for Workbox
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any
}

precacheAndRoute(self.__WB_MANIFEST)

// Handle messages from the registration script
self.addEventListener('message', event => {
  console.log('[SW] Received message:', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message - calling skipWaiting()')
    self.skipWaiting()
  }
})
