import React from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import api, { CancelToken, isCancel } from '../api'
import { activeTypesState, markersState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useUserLocation from '../utils/useUserLocation'
import Map from '../components/Map'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'

let cancelRequest


const MapContainer = props => {
  const [initalPosition, setInitalPosition] = React.useState()
  const [activeTypes] = useRecoilState(activeTypesState)
  const [markers, setMarkers] = useRecoilState(markersState)
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const { userLocation, accuracy, loading, error } = useUserLocation()
  const defaultPosition = [50.39805, 16.844417] // The area of Polish mountains.

  const mapRef = React.useRef()

  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

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
      setMarkers(points.map(item => serializeData(item)))
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
    // userLocation, because userLocation recognition may take more time.
    const position = getStoredPosition()
    setInitalPosition(position || { center: defaultPosition })
  }, [])

  React.useEffect(() => {
    // If user current location has been recognized and initial position is
    // default (unchanged), set user current location as an initial position.
    if (!loading && !error && initalPosition && JSON.stringify(initalPosition.center) === JSON.stringify(defaultPosition) && userLocation) {
      setInitalPosition({ center: userLocation })
    }
  }, [loading, initalPosition])

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={coords => setStoredPosition(coords)}
      getMarkers={getMarkers}
      markers={markers}
      userLocation={userLocation}
      locationAccuracy={accuracy}
      center={initalPosition && initalPosition.center}
      zoom={initalPosition && initalPosition.zoom}
      {...props}
      activeTypes={activeTypes}
      ref={mapRef}
    />
  )
}

export default MapContainer
