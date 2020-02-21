import React from 'react'
import getCurrentLocation from '../utils/getCurrentLocation'

const CurrentLocationContext = React.createContext([null, () => {}])

const CurrentLocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = React.useState()

  React.useEffect(() => {
    getCurrentLocation(location => setCurrentLocation(location))
  }, [])

  return (
    <CurrentLocationContext.Provider value={[currentLocation, setCurrentLocation]}>
      {children}
    </CurrentLocationContext.Provider>
  )
}

export default CurrentLocationProvider

export const useCurrentLocation = () => {
  const [currentLocation] = React.useContext(CurrentLocationContext)
  return currentLocation
}
