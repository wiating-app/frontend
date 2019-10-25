import React from 'react'
import { geolocated } from 'react-geolocated'
import { useAuth0 } from '../react-auth0-wrapper'
import Map from '../components/Map'

const MapContainer = props => {
  const {
    isLoggedIn,
    setStoredPosition,
    getStoredPosition,
  } = useAuth0()

  return (
    <Map
      onContextMenuClose={props.closeContextMenu}
      onContextMenu={props.openContextMenu}
      openLocationTab={props.openLocationTab}
      onUpdateMarkerPosition={props.onUpdateMarkerPosition}
      isLoggedIn={isLoggedIn}
      setStoredPosition={setStoredPosition}
      getStoredPosition={getStoredPosition}
      initCoords={props.coords}
    />
  )
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(MapContainer)
