import React from 'react'
import { LatLngBounds } from 'leaflet'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import Map from '../components/Map'
import { activeTypesState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useMapMarkers } from '../utils/useMapMarkers'
import useUserLocation from '../utils/useUserLocation'
import AddButtonContainer from './AddButtonContainer'

interface MapContainerProps {
  [key: string]: any
}

const MapContainer = (props: MapContainerProps) => {
  const [initialPosition, setInitialPosition] = React.useState<{
    center?: [number, number]
    bounds?: any
    zoom?: number
  }>({})
  const [activeTypes] = useRecoilState(activeTypesState)
  const [currentBounds, setCurrentBounds] = React.useState<LatLngBounds | null>(null)
  const { translations } = useLanguage()
  const { userLocation, accuracy, loading, error } = useUserLocation()

  const { isLoggedIn, setStoredPosition, getStoredPosition } = useAuth0()

  // Use the grid-based markers hook
  const { markers, isLoading: markersLoading, isError: markersError } = useMapMarkers(currentBounds)

  // Show error toast if markers fail to load
  React.useEffect(() => {
    if (markersError) {
      toast.error(translations.connectionProblemMap)
    }
  }, [markersError, translations.connectionProblemMap])

  // Callback to update bounds when map moves
  // React-query handles caching, so no debouncing needed
  const handleBoundsChange = React.useCallback((bounds: LatLngBounds) => {
    setCurrentBounds(bounds)
  }, [])

  React.useEffect(() => {
    // Check stored position before userLocation recognition, becuse it may take
    // more time to get it.
    const storedPosition = getStoredPosition()
    if (storedPosition) setInitialPosition(storedPosition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    // If user current location has been recognized and map position is
    // default (unchanged), set user current location as a new initial position.
    if (!loading && !error && !initialPosition.bounds && userLocation) {
      setInitialPosition({ center: userLocation, zoom: 10 })
    }
  }, [loading, error, initialPosition.bounds, userLocation])

  return (
    <>
      <Map
        isLoggedIn={isLoggedIn}
        setStoredPosition={(coords: any) => setStoredPosition(coords)}
        onBoundsChange={handleBoundsChange}
        markers={markers}
        markersLoading={markersLoading}
        userLocation={userLocation}
        locationAccuracy={accuracy}
        center={initialPosition.center}
        bounds={initialPosition.bounds}
        zoom={initialPosition.zoom}
        currentBounds={currentBounds}
        {...props}
        activeTypes={activeTypes}
      />
      <AddButtonContainer />
    </>
  )
}

export default MapContainer
