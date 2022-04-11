import { activeTypesState, markersState } from '../state'
import api, { CancelToken, isCancel } from '../api'

import AddButtonContainer from './AddButtonContainer'
import Map from '../components/Map'
import React from 'react'
import serializeData from '../utils/serializeData'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import useUserLocation from '../utils/useUserLocation'

let cancelRequest


const MapContainer = props => {
  const [initialPosition, setInitialPosition] = React.useState({})
  const [activeTypes] = useRecoilState(activeTypesState)
  const [markers, setMarkers] = useRecoilState(markersState)
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const { userLocation, accuracy, loading, error } = useUserLocation()

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
    const bounds = getStoredPosition()
    if (bounds) setInitialPosition({ bounds })
  }, [])

  React.useEffect(() => {
    // If user current location has been recognized and initial position is
    // default (unchanged), set user current location as an initial position.
    if (!loading && !error && !initialPosition.bounds && userLocation) {
      setInitialPosition({ center: userLocation })
    }
  }, [loading])

  return <>
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={coords => setStoredPosition(coords)}
      getMarkers={getMarkers}
      markers={markers}
      userLocation={userLocation}
      locationAccuracy={accuracy}
      center={initialPosition.center}
      bounds={initialPosition.bounds}
      {...props}
      activeTypes={activeTypes}
    />
    <AddButtonContainer />
  </>
}

export default MapContainer
