import React from 'react'


const CurrentLocationContext = React.createContext([null, () => {}])


export const CurrentLocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = React.useState({
    location: null,
    loading: true,
    error: false,
  })

  React.useEffect(() => {
    const getCurrentLocationHandler = () => {
      getCurrentLocation(
        // Success
        location => setCurrentLocation({
          location,
          loading: false,
          error: false,
        }),
        // Error
        () => setCurrentLocation({
          location: null,
          loading: false,
          error: true,
        })
      )
    }

    getCurrentLocationHandler()

    const interval = setInterval(() => {
      console.log('Updating current location info.')
      getCurrentLocationHandler()
    }, 30000) // 30 seconds.

    return () => clearInterval(interval)
  }, [])

  return (
    <CurrentLocationContext.Provider value={[currentLocation, setCurrentLocation]}>
      {children}
    </CurrentLocationContext.Provider>
  )
}


const useCurrentLocation = () => {
  const [currentLocation] = React.useContext(CurrentLocationContext)
  return currentLocation
}


const getCurrentLocation = (callback, errorCallback) => {
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    // Check if geolocation is supported/enabled on current browser.
    navigator.geolocation.getCurrentPosition(
      function success(position) {
        // For when getting location is a success.
        callback([position.coords.latitude, position.coords.longitude])
      },
      function error(errorMessage) {
        console.error(errorMessage.message)
        errorCallback()
      }
    )
  } else {
    console.warn('Geolocation is not enabled on this browser.')
    errorCallback()
  }
}

export default useCurrentLocation
