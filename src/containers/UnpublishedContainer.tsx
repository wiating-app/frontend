import React from 'react'
import useAuth0 from '../utils/useAuth0'
import UnpublishedLocations from '../components/UnpublishedLocations'
import { getUnpublished } from '../api/getUnpublished'
import { Location } from '../typings'

const UnpublishedContainer = () => {
  const { isModerator } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [locations, setLocations] = React.useState<Location[]>()

  const fetchUnpublished = async () => {
    try {
      setLoading(true)
      const locations = await getUnpublished()
      setLocations(locations)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }
  React.useEffect(() => { isModerator && fetchUnpublished() }, [isModerator])

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

