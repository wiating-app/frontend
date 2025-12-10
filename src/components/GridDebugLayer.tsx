import React from 'react'
import { LatLngBounds, latLngBounds } from 'leaflet'
import { Rectangle, useMap } from 'react-leaflet'
import { getGridCellBounds, getVisibleGridCells } from '../utils/mapGrid'

interface GridDebugLayerProps {
  bounds?: LatLngBounds | null | undefined
}

/**
 * Visual debugging layer that displays grid cells on the map.
 * Only visible in development mode.
 * Shows the grid cells that are currently being queried for markers.
 */
const GridDebugLayer: React.FC<GridDebugLayerProps> = ({ bounds: propsBounds }) => {
  const map = useMap()
  const [mapBounds, setMapBounds] = React.useState<LatLngBounds | null>(null)

  // Update map bounds when map moves
  React.useEffect(() => {
    // Only set up listeners in development
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const updateBounds = () => {
      try {
        const currentBounds = map.getBounds()
        setMapBounds(currentBounds)
      } catch {
        // Ignore errors
      }
    }

    updateBounds()
    map.on('moveend', updateBounds)
    map.on('zoomend', updateBounds)

    return () => {
      map.off('moveend', updateBounds)
      map.off('zoomend', updateBounds)
    }
  }, [map])

  // Use props bounds if provided, otherwise use map bounds
  const bounds = propsBounds || mapBounds

  const visibleCells = React.useMemo(() => {
    // Only calculate in development
    if (process.env.NODE_ENV !== 'development' || !bounds) {
      return []
    }

    try {
      return getVisibleGridCells(bounds)
    } catch {
      console.error('Error calculating visible grid cells for debug layer')
      return []
    }
  }, [bounds])

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !bounds) {
    return null
  }

  return (
    <>
      {visibleCells.map(cellId => {
        const cellBounds = getGridCellBounds(cellId)
        const rectangleBounds = latLngBounds(
          [cellBounds.bottom_left.lat, cellBounds.bottom_left.lon],
          [cellBounds.top_right.lat, cellBounds.top_right.lon],
        )

        return (
          <Rectangle
            key={cellId}
            bounds={rectangleBounds}
            pathOptions={{
              color: '#6b7280', // gray-500
              fillOpacity: 0,
              weight: 1,
              opacity: 0.15,
            }}
            eventHandlers={{
              mouseover: e => {
                const layer = e.target
                layer.setStyle({
                  fillOpacity: 0.2,
                  weight: 2,
                })
              },
              mouseout: e => {
                const layer = e.target
                layer.setStyle({
                  fillOpacity: 0.1,
                  weight: 1,
                })
              },
            }}
          />
        )
      })}
    </>
  )
}

export default GridDebugLayer
