import React from 'react'

interface MapLoadingIndicatorProps {
  isLoading: boolean
}

/**
 * Thin animated loading indicator displayed at the top edge of the map.
 * Shows a progress bar animation when markers are being loaded.
 */
const MapLoadingIndicator: React.FC<MapLoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="absolute left-0 right-0 top-0 z-[1000] h-0.5 overflow-hidden bg-gray-400">
      <div className="animate-loading-bar h-full w-2/5 bg-gray-200" />
    </div>
  )
}

export default MapLoadingIndicator
