import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useLanguage from './useLanguage'

/**
 * Hook to detect online/offline status
 *
 * Useful for:
 * - Showing offline indicators
 * - Disabling features that require internet
 * - Adjusting retry logic in queries
 */
export function useOfflineStatus(): { isOffline: boolean; requireOnline: (callback: () => void) => void } {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const { translations } = useLanguage()

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

  const requireOnline = useCallback(
    (callback: () => void) => {
      if (isOffline) {
        toast(translations?.mustBeOnline)
      } else {
        callback()
      }
    },
    [isOffline, translations],
  )

  return { isOffline, requireOnline }
}
