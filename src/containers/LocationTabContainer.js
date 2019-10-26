import React from 'react'
import { useAuth0 } from '../react-auth0-wrapper'
import LocationTab from '../components/LocationTab'

const LocationTabContainer = props => {
  const { isLoggedIn } = useAuth0()
  return (
    <LocationTab
      loggedIn={isLoggedIn}
      {...props}
    />
  )
}

export default LocationTabContainer
