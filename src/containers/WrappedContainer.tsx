import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getPoint } from '../api/getPoint'
import { getWrapped } from '../api/getWrapped'
import Wrapped from '../components/Wrapped'
import history from '../history'
import useAuth0 from '../utils/useAuth0'

const WrappedContainer = () => {
  const { isLoggedIn, canSeeWrapped } = useAuth0()
  const [shouldFetchLocation, setShouldFetchLocation] = React.useState(false)
  const queryClient = useQueryClient()

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
    queryKey: ['wrappedLocation'],
    queryFn: () => getPoint(stats!.user_top_loc),
    enabled: shouldFetchLocation && !!stats?.user_top_loc,
  })

  React.useEffect(() => {
    if (shouldFetchLocation && isErrorLocation) {
      toast.error('Nie udało się załadować informacji o lokacji.')
    }
  }, [shouldFetchLocation, isErrorLocation])

  const setDismissed = React.useCallback(() => {
    const year = stats?.year || new Date().getFullYear() // Handle also the case when stats are not loaded because of exception
    const dismissedKey = `wrappedDismissed_${year}`
    localStorage.setItem(dismissedKey, 'true')
  }, [stats?.year])

  const handleShowLocation = () => {
    setShouldFetchLocation(true)
  }

  const handleViewLocation = () => {
    if (stats?.user_top_loc) {
      setDismissed()
      history.push(`/location/${stats.user_top_loc}`)
      queryClient.setQueryData(['activeLocation'], location)
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
