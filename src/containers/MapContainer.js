import React from 'react'
import { useSnackbar } from 'notistack'
import api, { CancelToken, isCancel } from '../api'
import { useAuth0 } from '../utils/auth0Provider'
import { useCurrentLocation } from '../utils/CurrentLocationProvider'
import Map from '../components/Map'
import Text from '../components/Text'

let cancelRequest


const MapContainer = React.forwardRef((props, ref) => {
  const [points, setPoints] = React.useState()
  const [initalPosition, setInitalPosition] = React.useState()
  const { enqueueSnackbar } = useSnackbar()
  const { location, loading, error } = useCurrentLocation()
  const defaultPosition = [50.39805, 16.844417] // The area of Polish mountains.

  const mapRef = React.useRef()
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  const loadMapMarkers = async bounds => {
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
      }, {
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          cancelRequest = c
        }),
      })
      setPoints(points)
    } catch (error) {
      if (!isCancel(error)) {
        enqueueSnackbar(<Text id='connectionProblem.map' />, { variant: 'error' })
      } else {
        process.env.NODE_ENV === 'development' && console.log('Previous request canceled.')
      }
    }
  }

  React.useImperativeHandle(ref, () => ({
    setActiveMarker(coords) {
      mapRef.current.setActiveMarker(coords)
    },
    loadMapMarkers() {
      mapRef.current.loadMapMarkers()
    },
  }))

  React.useEffect(() => {
    // Check whether stored position is available asychronously from recognized
    // location, because location recognition may take undefined amount of time.
    const position = getStoredPosition()
    setInitalPosition(position || { center: defaultPosition })
  }, [])

  React.useEffect(() => {
    // If user location was recognized and initial position is not a default one,
    // set user location as an initial position.
    if (!loading && !error && JSON.stringify(initalPosition.center) === JSON.stringify(defaultPosition) && location) {
      setInitalPosition({ center: location })
    }
  }, [loading])

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={coords => setStoredPosition(coords)}
      loadMapMarkers={viewport => loadMapMarkers(viewport)}
      points={points}
      currentLocation={location}
      center={initalPosition && initalPosition.center}
      zoom={initalPosition && initalPosition.zoom}
      {...props}
      ref={mapRef}
    />
  )
})

export default MapContainer
