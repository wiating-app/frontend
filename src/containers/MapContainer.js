import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import { useAuth0 } from '../auth0'
import { useCurrentLocation } from '../containers/CurrentLocationProvider'
import Map from '../components/Map'
import Text from '../components/Text'


const MapContainer = React.forwardRef((props, ref) => {
  const [points, setPoints] = React.useState()
  const [initalPosition, setInitalPosition] = React.useState()
  const { enqueueSnackbar } = useSnackbar()
  const currentLocation = useCurrentLocation()

  const mapRef = React.useRef()
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  const loadMapMarkers = async bounds => {
    const { _northEast, _southWest } = bounds
    try {
      const { data: { points } } = await api.post('get_points', {
        top_right: {
          lat: _northEast.lat,
          lon: _northEast.lng,
        },
        bottom_left: {
          lat: _southWest.lat,
          lon: _southWest.lng,
        },
      })
      setPoints(points)
    } catch (error) {
      enqueueSnackbar(<Text id='connectionProblem.map' />, { variant: 'error' })
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
    const position = getStoredPosition()
    position && setInitalPosition(position)
  }, [])

  React.useEffect(() => {
    console.log('initalPosition: ', initalPosition);
    if ((!initalPosition || !Object.keys(initalPosition).length) && currentLocation) {
      setInitalPosition(currentLocation)
    }
  }, [currentLocation])

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={coords => setStoredPosition(coords)}
      loadMapMarkers={viewport => loadMapMarkers(viewport)}
      points={points}
      currentLocation={currentLocation}
      center={initalPosition && initalPosition.center}
      zoom={initalPosition && initalPosition.zoom}
      {...props}
      ref={mapRef}
    />
  )
})

export default MapContainer
