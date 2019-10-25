import React from 'react'
import { useAuth0 } from '../react-auth0-wrapper'
import LocationTab from '../components/LocationTab'

const LocationTabContainer = props => {
  const { isLoggedIn } = useAuth0()
  return (
    <LocationTab
      open={props.showLocationTab}
      location={props.selectedLocation}
      addMarkerX={props.addMarkerX}
      addMarkerY={props.addMarkerY}
      refreshMap={props.refreshMap}
      focusPoint={props.focusPoint}
      searchPhrase={props.searchPhrase}
      loggedIn={isLoggedIn}
    />
  )
}

export default LocationTabContainer
