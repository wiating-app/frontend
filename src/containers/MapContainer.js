import React from 'react'
import api from '../api'
import { useAuth0 } from '../auth0'
import Map from '../components/Map'

const MapContainer = React.forwardRef((props, ref) => {
  const [points, setPoints] = React.useState()
  const [initalPosition, setInitalPosition] = React.useState()

  const mapRef = React.useRef()
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  const loadMapMarkers = async bounds => {
    const { _northEast, _southWest } = bounds
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
  }

  React.useImperativeHandle(ref, () => ({
    clearAddMarker() {
      mapRef.current.clearAddMarker()
    },
    setNewMarker(lon, lat) {
      mapRef.current.setNewMarker(lon, lat)
    },
    loadMapMarkers() {
      mapRef.current.loadMapMarkers()
    },
    setMapCenter(lon, lat) {
      mapRef.current.setMapCenter(lon, lat)
    },
  }))

  React.useEffect(() => {
    const position = getStoredPosition()
    position && setInitalPosition(position)
  }, [])

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={setStoredPosition}
      loadMapMarkers={viewport => loadMapMarkers(viewport)}
      points={points}
      center={initalPosition && initalPosition.center}
      zoom={initalPosition && initalPosition.zoom}
      {...props}
      ref={mapRef}
    />
  )
})

export default MapContainer
