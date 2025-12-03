import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useAuth0 from '../utils/useAuth0'
import UnpublishedLocations from '../components/UnpublishedLocations'
import { getUnpublished } from '../api/getUnpublished'

const UnpublishedContainer = () => {
  const { isModerator } = useAuth0()

  const { data: locations, isLoading: loading, isError: error } = useQuery({
    queryKey: ['unpublished'],
    queryFn: getUnpublished,
    enabled: isModerator,
  })

  return (
    isModerator
      ? <UnpublishedLocations
        locations={locations}
        loading={loading}
        error={error}
      />
      : null
  )
}

export default UnpublishedContainer
