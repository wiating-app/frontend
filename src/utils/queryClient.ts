import type { Query } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import { PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { del, get, set } from 'idb-keyval'

// Cache configuration constants
// Used for both React Query cacheTime (garbage collection) and persistence maxAge (expiration)
// Keeping them the same ensures consistent cache behavior for PWA offline support
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7 // 7 days
const CACHE_BUSTER = '' // Change this string to invalidate cache (e.g., on app version change)
const IDB_KEY = 'REACT_QUERY_OFFLINE_CACHE'
// Query keys that should be persisted to IndexedDB for offline support
const PERSISTED_QUERY_KEYS = ['cacheGrid', 'user', 'userLogs', 'wrapped', 'wrappedLocation'] as const

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000, // 2 minutes - data is considered fresh for 2 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      cacheTime: CACHE_MAX_AGE,
    },
  },
})

/**
 * Creates an IndexedDB persister for React Query cache.
 *
 * This persister stores the React Query cache in IndexedDB, providing:
 * - Large storage capacity (hundreds of MB to GB) - perfect for PWA
 * - Asynchronous operations (non-blocking)
 * - Support for complex data structures
 * - Persistent across app restarts and offline usage
 */
export function createIDBPersister(): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(IDB_KEY, client)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[IDB Persister] Failed to persist client:', error)
        throw error
      }
    },
    restoreClient: async () => {
      try {
        return await get<PersistedClient>(IDB_KEY)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[IDB Persister] Failed to restore client:', error)
        return undefined
      }
    },
    removeClient: async () => {
      try {
        await del(IDB_KEY)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[IDB Persister] Failed to remove client:', error)
        throw error
      }
    },
  }
}

// Create persister instance for offline PWA support
const persister = createIDBPersister()

export const persistOptions = {
  persister,
  maxAge: CACHE_MAX_AGE,
  buster: CACHE_BUSTER,
  dehydrateOptions: {
    // Only persist specific query keys for offline support
    shouldDehydrateQuery: (query: Query) => {
      const firstKey = query.queryKey[0]
      return PERSISTED_QUERY_KEYS.includes(firstKey as (typeof PERSISTED_QUERY_KEYS)[number])
    },
  },
}
