import React from 'react'
import api from '../api'
import { useAuth0 } from '../auth0'
import Map from '../components/Map'

const MapContainer = React.forwardRef((props, ref) => {
  const [points, setPoints] = React.useState()
  const mapRef = React.useRef()
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  const loadMapMarkers = async ({ lbx, lby, rtx, rty }) => {
    const { data: { points }, ...rest } = await api.post('get_points', {
      top_right: {
        lat: rty,
        lon: rtx,
      },
      bottom_left: {
        lat: lby,
        lon: lbx,
      },
    })
    console.log('headers: ', rest.headers);
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
