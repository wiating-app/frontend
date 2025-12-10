import React from 'react'

interface UserLocationState {
  userLocation: [number, number] | null
  accuracy: number | null
  loading: boolean
  error: boolean
}

const CurrentLocationContext = React.createContext<UserLocationState>({
  userLocation: null,
  accuracy: null,
  loading: true,
  error: false,
})

interface UserLocationProviderProps {
  children: React.ReactNode
}

export const UserLocationProvider = ({ children }: UserLocationProviderProps) => {
  const [userLocation, setUserLocation] = React.useState<UserLocationState>({
    userLocation: null,
    accuracy: null,
    loading: true,
    error: false,
  })

  const getCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      // Check if geolocation is supported/enabled on current browser.
      navigator.geolocation.getCurrentPosition(
        function success(location: GeolocationPosition) {
          // For when getting location is a success.
          const {
            coords: { latitude, longitude, accuracy },
          } = location
          setUserLocation({
            userLocation: [latitude, longitude],
            accuracy,
            loading: false,
            error: false,
          })
        },
        function error(err: GeolocationPositionError) {
          // For when getting location had an error.
          console.error(err.message)
          setUserLocation({
            userLocation: null,
            accuracy: null,
            loading: false,
            error: true,
          })
        },
      )
    } else {
      console.warn('Geolocation is not enabled on this browser.')
      setUserLocation({
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

  return <CurrentLocationContext.Provider value={userLocation}>{children}</CurrentLocationContext.Provider>
}

const useUserLocation = (): UserLocationState => {
  return React.useContext(CurrentLocationContext)
}

export default useUserLocation
