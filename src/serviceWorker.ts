// @ts-ignore - workbox is injected at build time
workbox.precaching.precacheAndRoute(self.__precacheManifest)

addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // @ts-ignore - skipWaiting is a service worker global
    skipWaiting()
  }
})
