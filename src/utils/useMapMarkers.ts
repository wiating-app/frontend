import React from 'react'
import { useQueries } from '@tanstack/react-query'
import { LatLngBounds } from 'leaflet'
import pLimit from 'p-limit'
import { getPoints } from '../api/getPoints'
import { Location } from '../typings'
import { getGridCellBounds, getVisibleGridCells } from './mapGrid'
import { useOfflineStatus } from './useOfflineStatus'

// Create a limiter instance to control concurrency
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const limit = pLimit(3)

interface UseMapMarkersResult {
  markers: Location[]
  isLoading: boolean
  isError: boolean
}

/**
 * Custom hook to fetch map markers using a grid-based caching system.
 * Divides the world into grid cells and fetches points for each visible cell,
 * enabling effective caching with react-query.
 */
export function useMapMarkers(bounds: LatLngBounds | null | undefined): UseMapMarkersResult {
  const { isOffline } = useOfflineStatus()

  // Calculate visible grid cells
  const visibleCells = React.useMemo(() => {
    if (!bounds) return []
    try {
      return getVisibleGridCells(bounds)
    } catch (error) {
      console.error('Error calculating visible grid cells:', error)
      return []
    }
  }, [bounds])

  // Create query options for each visible grid cell
  const queries = React.useMemo(() => {
    return visibleCells.map(cellId => ({
      queryKey: ['cacheGrid', cellId] as const,
      queryFn: async (): Promise<Location[]> => {
        // Wrap the async function with p-limit to control concurrency
        return limit(async () => {
          const cellBounds = getGridCellBounds(cellId)
          return getPoints(cellBounds)
        })
      },
      enabled: !isOffline,
    }))
  }, [visibleCells, isOffline])

  // Execute all queries
  const queryResults = useQueries({
    queries,
  })

  // Combine results and deduplicate markers by id
  const markers = React.useMemo(() => {
    const allMarkers: Location[] = []
    const seenIds = new Set<string>()

    for (const result of queryResults) {
      if (result.data) {
        for (const marker of result.data) {
          if (!seenIds.has(marker.id)) {
            seenIds.add(marker.id)
            allMarkers.push(marker)
          }
        }
      }
    }

    return allMarkers
  }, [queryResults])

  // Determine loading state (at least one query is loading)
  // Don't report loading when offline, even if queries are in loading state
  const isLoading = !isOffline && queryResults.some(result => result.isLoading)

  // Determine error state (at least one query has error)
  // Don't report errors when offline, as we're not attempting to fetch
  const isError = !isOffline && queryResults.some(result => result.isError)

  return {
    markers,
    isLoading,
    isError,
  }
}
