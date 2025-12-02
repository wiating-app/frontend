/* eslint-disable no-console */
import { Workbox } from 'workbox-window'

export default function enableServiceWorker() {
  // Only register service worker in production
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // Check if this is a reload after an update - handled by AuthProvider
    // AuthProvider will check for 'sw-update-reload' and show notification

    // Wait for page load for better performance
    window.addEventListener('load', () => {
      const wb = new Workbox('/service-worker.js')

      // Function to handle update prompt
      const promptForUpdate = () => {
        console.log('[SW] Prompting user for update')
        if (confirm('A new version is available! Would you like to update?')) {
          wb.messageSkipWaiting()
          console.log('[SW] Sent skipWaiting message to service worker')
          return true
        }
        return false
      }

      // Fires when the registered service worker has installed but is waiting to activate
      wb.addEventListener('installed', event => {
        // Check if this is an update - either Workbox says so, or there's already an active service worker
        const isUpdate = event.isUpdate || navigator.serviceWorker.controller !== null

        console.log('[SW] Service worker installed:', {
          isUpdateFromEvent: event.isUpdate,
          hasActiveController: navigator.serviceWorker.controller !== null,
          finalIsUpdate: isUpdate,
        })

        if (isUpdate) {
          console.log('[SW] New service worker installed and waiting (update detected)')
          promptForUpdate()
        } else {
          console.log('[SW] Service worker installed for the first time')
        }
      })

      // When the new service worker takes control
      wb.addEventListener('controlling', () => {
        console.log('[SW] New service worker is now controlling the page')
        // Set flag in sessionStorage before reload
        sessionStorage.setItem('sw-update-reload', 'true')
        // Reload the page to ensure all resources are served by the new service worker
        window.location.reload()
      })

      // Handle registration errors gracefully
      wb.register()
        .then(registration => {
          console.log('[SW] Service worker registered successfully')
          if (registration && registration.waiting) {
            console.log('[SW] Found waiting service worker on registration')
            promptForUpdate()
          }
        })
        .catch(error => {
          console.warn('[SW] Service worker registration failed:', error)
        })

      const CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds
      let nextCheckTime = Date.now() + CHECK_INTERVAL
      let checkTimeout

      // Function to check for updates
      const checkForUpdates = () => {
        if (document.visibilityState === 'visible') {
          console.log('[SW] Checking for updates...', new Date().toISOString())
          wb.update()
            .then(() => {
              console.log('[SW] Update check completed successfully')
            })
            .catch(error => {
              console.warn('[SW] Periodic update check failed:', error)
            })
        } else {
          console.log('[SW] Skipping update check - page not visible')
        }
      }

      // Function to schedule next check
      const scheduleNextCheck = () => {
        const now = Date.now()
        nextCheckTime = now + CHECK_INTERVAL

        // Clear existing timeout if any
        if (checkTimeout) {
          clearTimeout(checkTimeout)
        }

        // Schedule the next check
        checkTimeout = setTimeout(() => {
          if (document.visibilityState === 'visible') {
            checkForUpdates()
          }
          scheduleNextCheck() // Schedule next check regardless of visibility
        }, CHECK_INTERVAL)
      }

      // Start the continuous counter
      console.log('[SW] Starting update counter every', CHECK_INTERVAL, 'ms')
      scheduleNextCheck()

      // Check counter status when page becomes visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('[SW] Page visible - checking counter status')
          const now = Date.now()
          if (now >= nextCheckTime) {
            console.log('[SW] Counter has elapsed, checking for updates')
            checkForUpdates()
            scheduleNextCheck()
          } else {
            console.log('[SW] Counter still running, next check in', (nextCheckTime - now) / 1000, 'seconds')
          }
        }
      })

      // Clean up on page unload
      window.addEventListener('unload', () => {
        console.log('[SW] Page unloading - cleaning up')
        if (checkTimeout) {
          clearTimeout(checkTimeout)
        }
      })
    })
  }
}
