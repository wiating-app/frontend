import React from 'react'


const CurrentLocationContext = React.createContext([null, () => {}])


export const UserLocationProvider = ({ children }) => {
  const [userLocation, userUserLocation] = React.useState({
    userLocation: null,
    accuracy: null,
    loading: true,
    error: false,
  })

  const getCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      // Check if geolocation is supported/enabled on current browser.
      navigator.geolocation.getCurrentPosition(
        function success(location) {
          // For when getting location is a success.
          const { coords: { latitude, longitude, accuracy } } = location
          userUserLocation({
            userLocation: [latitude, longitude],
            accuracy,
            loading: false,
            error: false,
          })
        },
        function error(err) {
          // For when getting location had an error.
          console.error(err.message)
          userUserLocation({
            userLocation: null,
            accuracy: null,
            loading: false,
            error: true,
          })
        }
      )
    } else {
      console.warn('Geolocation is not enabled on this browser.')
      userUserLocation({
        userLocation: null,
        accuracy: null,
        loading: false,
        error: true,
      })
    }
  }

  // Location pooling.
  React.useEffect(() => {
    getCurrentLocation()

    const interval = setInterval(() => {
      getCurrentLocation()
    }, 1000000) // 100 seconds.

    return () => clearInterval(interval)
  }, [])

  return (
    <CurrentLocationContext.Provider value={userLocation}>
      {children}
    </CurrentLocationContext.Provider>
  )
}


const useUserLocation = () => React.useContext(CurrentLocationContext)
export default useUserLocation
