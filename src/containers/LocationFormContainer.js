import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import { withRouter } from 'react-router-dom'
import parse from 'coord-parser'
import LocationForm from '../components/LocationForm'
import Text from '../components/Text'
import Loader from '../components/Loader'


const LocationFormContainer = ({
  cachedLocation,
  setCachedLocation,
  refreshMap,
  isNew,
  history,
  match,
}) => {
  const { params: { id } } = match
  const [location, setLocation] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const { enqueueSnackbar } = useSnackbar()

  React.useEffect(() => {
    setLocation(cachedLocation)
  }, [cachedLocation])

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (cachedLocation) {
      setLocation(cachedLocation)
      setLoading(false)
    } else {
      if (id) {
        const handleAsync = async () => {
          try {
            const { data } = await api.post('get_point', { id })
            setLocation(data)
            setCachedLocation(data)
          } catch (error) {
            setError(true)
          }
          setLoading(false)
        }
        handleAsync()
      } else {
        setLoading(false)
      }
    }
  }, [])

  const onSubmitLocation = async fields => {
    /* eslint-disable camelcase */
    const {
      name,
      description,
      directions,
      type,
      location,
      water_exists,
      water_comment,
      fire_exists,
      fire_comment,
    } = fields

    try {
      const { lat, lon } = parse(location)
      const data = {
        name,
        description,
        directions,
        lat: lat,
        lon: lon,
        type,
        water_exists: water_exists || false,
        water_comment: water_exists ? water_comment : false,
        fire_exists: fire_exists || false,
        fire_comment: fire_exists ? fire_comment : false,
      }

      if (isNew) {
        // New marker creation.
        const newData = await api.post('add_point', data)
        console.log('response: ', newData)
        setLocation(newData)
        setCachedLocation(newData)
        history.push(`/location/${_id}`)
        enqueueSnackbar(<Text id='notifications.newMarkerAdded' />, { variant: 'success' })
      } else {
        // Updating exisitng marker.
        const { id } = cachedLocation
        const newData = await api.post('modify_point', { id, ...data })
        console.log('response: ', newData)
        setLocation(newData)
        setCachedLocation(newData)
        history.push(`/location/${_id}`)
        enqueueSnackbar(<Text id='notifications.markerUpdated' />, { variant: 'success' })
      }
      refreshMap()
    } catch (error) {
      if (error.type === 'parseError') {
        console.error(error.value)
        enqueueSnackbar(<Text id='notifications.wrongCoordsFormat' />, { variant: 'error' })
      } else {
        console.error(error)
        enqueueSnackbar(<Text id='notifications.couldNotSaveMarker' />, { variant: 'error' })
      }
    }
  }

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <LocationForm
          locationData={location}
          onSubmitLocation={onSubmitLocation}
          updateCurrentMarker={coords => {
            const { lat, lon } = parse(coords)
            if (location.location.lat !== lat || location.location.lon !== lon) {
              setCachedLocation({ ...location, location: { lat, lon } })
            }
          }}
          cancel={() => history.goBack()}
          isNew={isNew}
        />
  )
}

export default withRouter(LocationFormContainer)
