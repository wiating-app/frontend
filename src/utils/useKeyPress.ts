import { useEffect } from 'react'

export default function useKeypress(key: string, action: () => void): void {
  useEffect(() => {
    const onKeyup = (e: KeyboardEvent) => {
      if (e.key === key) action()
    }
    window.addEventListener('keyup', onKeyup)
    return () => window.removeEventListener('keyup', onKeyup)
  }, [key, action])
}

