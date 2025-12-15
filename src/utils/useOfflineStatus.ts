import { useEffect, useState } from 'react'

/**
 * Hook to detect online/offline status
 *
 * Useful for:
 * - Showing offline indicators
 * - Disabling features that require internet
 * - Adjusting retry logic in queries
 */
export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
    }

    const handleOffline = () => {
      setIsOffline(true)
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOffline
}
