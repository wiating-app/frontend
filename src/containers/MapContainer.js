import React from 'react'
import { API } from '../api'
import { useAuth0 } from '../react-auth0-wrapper'
import Map from '../components/Map'

const api = new API()

const MapContainer = React.forwardRef((props, ref) => {
  const [points, setPoints] = React.useState()
  const mapRef = React.useRef()
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  const loadMapMarkers = async viewport => {
    const points = await api.getMapPoints(viewport.lbx, viewport.lby, viewport.rtx, viewport.rty)
    setPoints(points)
  }

  React.useImperativeHandle(ref, () => ({
    clearAddMarker() {
      mapRef.current.clearAddMarker()
    },
    loadMapMarkers() {
      mapRef.current.loadMapMarkers()
    },
    setMapCenter(posY, posX) {
      mapRef.current.setMapCenter(posY, posX)
    },
  }))

  return (
    <Map
      isLoggedIn={isLoggedIn}
      setStoredPosition={setStoredPosition}
      getStoredPosition={getStoredPosition}
      loadMapMarkers={viewport => loadMapMarkers(viewport)}
      points={points}
      {...props}
      ref={mapRef}
    />
  )
})

export default MapContainer
