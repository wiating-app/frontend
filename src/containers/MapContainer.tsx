import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LatLngBounds } from 'leaflet'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import Map from '../components/Map'
import history from '../history'
import { activeTypesState, editModeState } from '../state'
import { Location } from '../typings'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useMapMarkers } from '../utils/useMapMarkers'
import useUserLocation from '../utils/useUserLocation'
import AddButtonContainer from './AddButtonContainer'

const MapContainer = () => {
  const [initialPosition, setInitialPosition] = React.useState<{
    center?: [number, number]
    bounds?: any
    zoom?: number
  }>({})
  const [activeTypes] = useRecoilState(activeTypesState)
  const [editMode] = useRecoilState(editModeState)
  const [currentBounds, setCurrentBounds] = React.useState<LatLngBounds | null>(null)
  const { translations } = useLanguage()
  const { userLocation, accuracy, loading, error } = useUserLocation()
  const queryClient = useQueryClient()
  const { isLoggedIn, setStoredPosition, getStoredPosition } = useAuth0()

  // Use the grid-based markers hook
  const { markers, isLoading: markersLoading, isError: markersError } = useMapMarkers(currentBounds)
  console.log('markersLoading: ', markersLoading)

  // Observe temp location (for context menu) from react-query cache
  const { data: tempLocation } = useQuery({
    queryKey: ['contextMenuLocation'],
    queryFn: () => queryClient.getQueryData<Location>(['contextMenuLocation']) ?? null,
    enabled: true,
    staleTime: Infinity,
    cacheTime: Infinity, // Keep in cache indefinitely
  })

  // Observe URL-based location from react-query cache
  const { data: activeLocation } = useQuery({
    queryKey: ['activeLocation'],
    queryFn: () => queryClient.getQueryData<Location>(['activeLocation']) ?? null,
    enabled: true,
    staleTime: Infinity,
    cacheTime: Infinity, // Keep in cache indefinitely
  })

  // Always prioritize temp location (for context menu) over URL location
  const markerLocation = tempLocation || activeLocation
  const hasContextMenu = !!tempLocation

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

  const handleLocationClick = React.useCallback(
    (location: Location) => {
      queryClient.setQueryData(['searchResults'], [])
      queryClient.setQueryData(['contextMenuLocation'], null)
      queryClient.setQueryData(['activeLocation'], location)
      history.push(`/location/${location.id}`)
    },
    [queryClient],
  )

  const handleMapClick = React.useCallback(
    (lat: number, lng: number) => {
      if (hasContextMenu) {
        // Always clear context menu if it's open
        queryClient.setQueryData(['contextMenuLocation'], null)
      } else if (editMode && isLoggedIn && !markerLocation) {
        // Handle mode of setting location by pinning on map.
        history.push(`/location/new?lat=${lat}&lng=${lng}`)
      }
    },
    [hasContextMenu, editMode, isLoggedIn, markerLocation, queryClient],
  )

  const handleMapRightClick = React.useCallback(
    (lat: number, lng: number) => {
      if (!editMode && isLoggedIn && !tempLocation) {
        // Opening context menu - set temp location
        queryClient.setQueryData(['contextMenuLocation'], {
          location: {
            lat,
            lng,
          },
        })
        history.push('/')
      }
    },
    [editMode, isLoggedIn, tempLocation, queryClient],
  )

  const handleCurrentMoveEnd = React.useCallback(
    (lat: number, lng: number) => {
      const updatedLocation = {
        ...markerLocation,
        location: {
          lat,
          lng,
        },
      } as Location
      queryClient.setQueryData(['activeLocation'], updatedLocation)
    },
    [markerLocation, queryClient],
  )

  const handleAddLocationHere = React.useCallback(
    (lat: number, lng: number) => {
      queryClient.setQueryData(['contextMenuLocation'], null)
      history.push(`/location/new?lat=${lat}&lng=${lng}`)
    },
    [queryClient],
  )

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
        markers={markers}
        markersLoading={markersLoading}
        userLocation={userLocation}
        locationAccuracy={accuracy}
        center={initialPosition.center}
        bounds={initialPosition.bounds}
        zoom={initialPosition.zoom}
        currentBounds={currentBounds}
        markerLocation={markerLocation}
        hasContextMenu={hasContextMenu}
        onBoundsChange={handleBoundsChange}
        onLocationClick={handleLocationClick}
        onMapRightClick={handleMapRightClick}
        onMapClick={handleMapClick}
        onCurrentMoveEnd={handleCurrentMoveEnd}
        onAddLocationHere={handleAddLocationHere}
        activeTypes={activeTypes}
      />
      <AddButtonContainer />
    </>
  )
}

export default MapContainer
