import React from 'react'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import { CancelToken, isCancel } from '../api'
import { getPoints } from '../api/getPoints'
import Map from '../components/Map'
import { activeTypesState, markersState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import useUserLocation from '../utils/useUserLocation'
import AddButtonContainer from './AddButtonContainer'

interface MapContainerProps {
  [key: string]: any
}

let cancelRequest: (() => void) | undefined

const MapContainer = (props: MapContainerProps) => {
  const [initialPosition, setInitialPosition] = React.useState<{
    center?: [number, number]
    bounds?: any
    zoom?: number
  }>({})
  const [activeTypes] = useRecoilState(activeTypesState)
  const [markers, setMarkers] = useRecoilState(markersState)
  const { translations } = useLanguage()
  const { userLocation, accuracy, loading, error } = useUserLocation()

  const { isLoggedIn, setStoredPosition, getStoredPosition } = useAuth0()

  const getMarkers = async (bounds: any) => {
    const { _northEast, _southWest } = bounds
    try {
      // Cancel the previous request if it is still running.
      cancelRequest && cancelRequest()
      const points = await getPoints(
        {
          top_right: {
            lat: _northEast.lat,
            lon: _northEast.lng,
          },
          bottom_left: {
            lat: _southWest.lat,
            lon: _southWest.lng,
          },
        },
        activeTypes.length ? activeTypes : undefined,
        {
          cancelToken: new CancelToken(function executor(c) {
            // An executor function receives a cancel function as a parameter
            cancelRequest = c
          }),
        },
      )
      setMarkers(points)
    } catch (error) {
      if (!isCancel(error)) {
        console.error(error)
        toast.error(translations.connectionProblemMap)
      } else {
        process.env.NODE_ENV === 'development' && console.log('Previous request canceled.')
      }
    }
  }

  React.useEffect(() => {
    // Check stored position before userLocation recognition, becuse it may take
    // more time to get it.
    const storedPosition = getStoredPosition()
    if (storedPosition) setInitialPosition(storedPosition)
  }, [])

  React.useEffect(() => {
    // If user current location has been recognized and map position is
    // default (unchanged), set user current location as a new initial position.
    if (!loading && !error && !initialPosition.bounds && userLocation) {
      setInitialPosition({ center: userLocation, zoom: 10 })
    }
  }, [loading])

  return (
    <>
      <Map
        isLoggedIn={isLoggedIn}
        setStoredPosition={(coords: any) => setStoredPosition(coords)}
        getMarkers={getMarkers}
        markers={markers}
        userLocation={userLocation}
        locationAccuracy={accuracy}
        center={initialPosition.center}
        bounds={initialPosition.bounds}
        zoom={initialPosition.zoom}
        {...props}
        activeTypes={activeTypes}
      />
      <AddButtonContainer />
    </>
  )
}

export default MapContainer
