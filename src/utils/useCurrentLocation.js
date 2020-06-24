import React from 'react'


const CurrentLocationContext = React.createContext([null, () => {}])


export const CurrentLocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = React.useState({
    currentLocation: null,
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
          console.log('Updated user location:', [latitude, longitude], 'Accuracy:', accuracy)
          setCurrentLocation({
            currentLocation: [latitude, longitude],
            accuracy,
            loading: false,
            error: false,
          })
        },
        function error(err) {
          // For when getting location had an error.
          console.error(err.message)
          setCurrentLocation({
            currentLocation: null,
            accuracy: null,
            loading: false,
            error: true,
          })
        }
      )
    } else {
      console.warn('Geolocation is not enabled on this browser.')
      setCurrentLocation({
        currentLocation: null,
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
    <CurrentLocationContext.Provider value={currentLocation}>
      {children}
    </CurrentLocationContext.Provider>
  )
}


const useCurrentLocation = () => React.useContext(CurrentLocationContext)
export default useCurrentLocation
