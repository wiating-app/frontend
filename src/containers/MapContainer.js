import React from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import api, { CancelToken, isCancel } from '../api'
import { activeTypesState, mapRefState, markersState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useCurrentLocation from '../utils/useCurrentLocation'
import Map from '../components/Map'
import useLanguage from '../utils/useLanguage'

let cancelRequest


const MapContainer = props => {
  const [initalPosition, setInitalPosition] = React.useState()
  const [activeTypes] = useRecoilState(activeTypesState)
  const [mapRef, setMapRef] = useRecoilState(mapRefState)
  const [markers, setMarkers] = useRecoilState(markersState)
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const { currentLocation, accuracy, loading, error } = useCurrentLocation()
  const defaultPosition = [50.39805, 16.844417] // The area of Polish mountains.

  const ref = React.useRef()

  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  React.useEffect(() => {
    // Let map ref be accesible globally.
    if (!mapRef && ref) {
      setMapRef({
        setActiveMarker: (coords) => {
          ref.current.setActiveMarker(coords)
        },
        loadMapMarkers: () => {
          ref.current.loadMapMarkers()
        },
      })
    }
  }, [mapRef, ref])

  const getMarkers = async bounds => {
    const { _northEast, _southWest } = bounds
    try {
      // Cancel the previous request if it is still running.
      cancelRequest && cancelRequest()
      const { data: { points } } = await api.post('get_points', {
        top_right: {
          lat: _northEast.lat,
          lon: _northEast.lng,
        },
        bottom_left: {
          lat: _southWest.lat,
          lon: _southWest.lng,
        },
        // eslint-disable-next-line camelcase
        ...activeTypes.length ? { point_type: activeTypes } : {},
      }, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancelRequest = c
        }),
      })
      setMarkers(points)
    } catch (error) {
      if (!isCancel(error)) {
        console.error(error)
        enqueueSnackbar(translations.connectionProblem.map, { variant: 'error' })
      } else {
        process.env.NODE_ENV === 'development' && console.log('Previous request canceled.')
      }
    }
  }

  React.useEffect(() => {
    // Check whether stored position is available asychronously from recognized
    // currentLocation, because currentLocation recognition may take more time.
    const position = getStoredPosition()
    setInitalPosition(position || { center: defaultPosition })
  }, [])

  React.useEffect(() => {
    // If user current location has been recognized and initial position is
    // default (unchanged), set user current location as an initial position.
    if (!loading && !error && initalPosition && JSON.stringify(initalPosition.center) === JSON.stringify(defaultPosition) && currentLocation) {
      setInitalPosition({ center: currentLocation })
    }
  }, [loading, initalPosition])

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={coords => setStoredPosition(coords)}
      getMarkers={getMarkers}
      markers={markers}
      currentLocation={currentLocation}
      locationAccuracy={accuracy}
      center={initalPosition && initalPosition.center}
      zoom={initalPosition && initalPosition.zoom}
      {...props}
      activeTypes={activeTypes}
      ref={ref}
    />
  )
}

export default MapContainer
