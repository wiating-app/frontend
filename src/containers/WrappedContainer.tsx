import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPoint } from '../api/getPoint'
import { getWrapped } from '../api/getWrapped'
import Wrapped from '../components/Wrapped'
import history from '../history'
import useAuth0 from '../utils/useAuth0'

const WrappedContainer = () => {
  const { isLoggedIn, canSeeWrapped } = useAuth0()
  const [shouldFetchLocation, setShouldFetchLocation] = React.useState(false)

  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['wrapped'],
    queryFn: getWrapped,
    enabled: isLoggedIn && canSeeWrapped,
  })

  const {
    data: location,
    isLoading: isLoadingLocation,
    isError: isErrorLocation,
  } = useQuery({
    queryKey: ['location', stats?.user_top_loc],
    queryFn: () => getPoint(stats!.user_top_loc),
    enabled: shouldFetchLocation && !!stats?.user_top_loc,
  })

  React.useEffect(() => {
    if (shouldFetchLocation && isErrorLocation) {
      toast.error('Nie udało się załadować informacji o lokacji.')
    }
  }, [shouldFetchLocation, isErrorLocation])

  const setDismissed = React.useCallback(() => {
    if (stats) {
      const dismissedKey = `wrappedDismissed_${stats.year}`
      localStorage.setItem(dismissedKey, 'true')
    }
  }, [stats])

  const handleShowLocation = () => {
    setShouldFetchLocation(true)
  }

  const handleViewLocation = () => {
    if (stats?.user_top_loc) {
      setDismissed()
      history.push(`/location/${stats.user_top_loc}`)
    }
  }

  const handleClose = () => {
    setDismissed()
    history.push('/')
  }

  return (
    <Wrapped
      stats={stats || null}
      isLoading={isLoading}
      isError={isError}
      onClose={handleClose}
      onShowLocation={handleShowLocation}
      onViewLocation={handleViewLocation}
      locationName={location?.name}
      isLoadingLocation={shouldFetchLocation && isLoadingLocation}
    />
  )
}

export default WrappedContainer
