import React from 'react'
import useAuth0 from '../utils/useAuth0'
import UnpublishedLocations from '../components/UnpublishedLocations'
import api from '../api'


const UnpublishedContainer = () => {
  const { isModerator } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [locations, setLocations] = React.useState()

  const getUnpublished = async () => {
    try {
      setLoading(true)
      const { data: { points } } = await api.post('get_unpublished', {})
      setLocations(points)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }
  React.useEffect(() => { isModerator && getUnpublished() }, [isModerator])

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
