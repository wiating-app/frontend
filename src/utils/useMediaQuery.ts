import { useState, useEffect } from 'react'

// Breakpoint defined inside the hook
const PHONE_BREAKPOINT = 640

/**
 * Custom hook for phone breakpoint detection
 * @returns Object with isPhone and isNotPhone boolean values
 */
const useMediaQuery = (): { isPhone: boolean; isNotPhone: boolean } => {
  const [isPhone, setIsPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(`(max-width: ${PHONE_BREAKPOINT - 1}px)`).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const phoneQuery = window.matchMedia(`(max-width: ${PHONE_BREAKPOINT - 1}px)`)

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsPhone(event.matches)
    }

    // Initial check
    handleChange(phoneQuery)

    // Listen for changes
    if (phoneQuery.addEventListener) {
      phoneQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      phoneQuery.addListener(handleChange)
    }

    return () => {
      if (phoneQuery.removeEventListener) {
        phoneQuery.removeEventListener('change', handleChange)
      } else {
        phoneQuery.removeListener(handleChange)
      }
    }
  }, [])

  return {
    isPhone,
    isNotPhone: !isPhone,
  }
}

export default useMediaQuery
