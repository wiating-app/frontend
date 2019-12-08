import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import { withRouter } from 'react-router-dom'
import LocationForm from '../components/LocationForm'
import Text from '../components/Text'
import Loader from '../components/Loader'


const LocationFormContainer = ({
  cachedLocation,
  setCachedLocation,
  isNew,
  history,
  match,
}) => {
  const { params: { id } } = match
  const [location, setLocation] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const { enqueueSnackbar } = useSnackbar()

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (cachedLocation) {
      setLocation(cachedLocation)
      setLoading(false)
    } else {
      const handleAsync = async () => {
        try {
          const { data: { _id, _source } } = await api.post('get_point', { id })
          const newData = { id: _id, ..._source }
          setLocation(newData)
          setCachedLocation(newData)
        } catch (error) {
          setError(true)
        }
        setLoading(false)
      }
      handleAsync()
    }
  }, [])

  const onSubmitLocation = async (fields, editExisting) => {
    /* eslint-disable camelcase */
    const {
      name,
      description,
      type,
      water_exists,
      water_comment,
      fire_exists,
      fire_comment,
    } = fields
    const [lat, lon] = fields.location.split(', ')

    const data = {
      name,
      description,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      type,
      water_exists: water_exists || false,
      water_comment: water_exists ? water_comment : false,
      fire_exists: fire_exists || false,
      fire_comment: fire_exists ? fire_comment : false,
    }
    console.log('data: ', data)

    try {
      if (editExisting) {
        const { id } = cachedLocation
        const { data: { _id, _source } } = await api.post('modify_point', { id, ...data })
        console.log('response: ', _id, _source)
        const newData = { id: _id, ..._source }
        setLocation(newData)
        setCachedLocation(newData)
        history.push(`/location/${_id}`)
        enqueueSnackbar(<Text id='notifications.markerUpdated' />, { variant: 'success' })
      } else {
        const { data: { _id, _source } } = await api.post('add_point', data)
        console.log('response: ', _id, _source)
        const newData = { id: _id, ..._source }
        setLocation(newData)
        setCachedLocation(newData)
        history.push(`/location/${_id}`)
        enqueueSnackbar(<Text id='notifications.newMarkerAdded' />, { variant: 'success' })
      }
      refreshMap()
    } catch (error) {
      console.error(error)
      enqueueSnackbar(<Text id='notifications.couldNotSaveMarker' />, { variant: 'error' })
    }
  }
  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <LocationForm
          locationData={location}
          onSubmitLocation={fields => onSubmitLocation(fields, true)}
          setActiveMarker={location => setActiveMarker(location)}
          cancel={() => history.goBack()}
          isNew={isNew}
        />
  )
}

export default withRouter(LocationFormContainer)
