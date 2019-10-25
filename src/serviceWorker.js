// More guidelines how to configure serviceworker with Workbox and Webpack at
// https://developers.google.com/web/tools/workbox/guides/generate-service-worker/webpack

export function register() {
  // Check that service workers are supported
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
    })
  }
}

export function unregister() {
  navigator.serviceWorker.getRegistrations().then(
    registrations => {
      for (let registration of registrations) {
        registration.unregister()
      }
    }
  )
}
