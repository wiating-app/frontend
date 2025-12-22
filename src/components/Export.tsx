import React from 'react'
import { LatLngBounds } from 'leaflet'
import { Download } from 'lucide-react'
import { Location } from '../typings'
import exportToGPX from '../utils/exportToGPX'
import exportToKML from '../utils/exportToKML'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Menu from './Menu'

interface ExportProps {
  markers: Location[]
  bounds?: LatLngBounds | null
  className?: string
}

const Export = ({ markers, bounds, className }: ExportProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const config = useConfig()
  const { translations } = useLanguage()

  // Filter markers by viewport bounds only when exporting
  const getVisibleMarkers = (): Location[] => {
    if (!bounds) {
      return markers
    }

    // Extract bounds values to avoid circular reference issues
    try {
      const northEast = bounds.getNorthEast()
      const southWest = bounds.getSouthWest()
      const minLat = southWest.lat
      const maxLat = northEast.lat
      const minLng = southWest.lng
      const maxLng = northEast.lng

      return markers.filter(marker => {
        const { lat, lng } = marker.location
        return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const items = [
    {
      label: translations?.downloadLocationsAsKML,
      callback: () => exportToKML(getVisibleMarkers(), config),
    },
    {
      label: translations?.downloadLocationsAsGPX,
      callback: () => exportToGPX(getVisibleMarkers(), config),
    },
  ]

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!config.settings.enableExport) return null

  return (
    <div className="relative">
      <a className={className} onClick={handleClick}>
        <Download size={16} strokeWidth={2.5} />
      </a>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleClose} />
          <div className="absolute right-0 top-full z-20 mt-1">
            <Menu
              header={translations?.exportAreaHeader}
              items={items}
              onClose={handleClose}
              className="min-w-[200px]"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Export
