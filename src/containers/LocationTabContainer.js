import React from 'react'
import { withRouter } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import api from '../api'
import LocationTab from '../components/LocationTab'
import Text from '../components/Text'


const LocationTabContainer = ({
  selectedLocation,
  setSelectedLocation,
  refreshMap,
  closeLocationTab,
  history,
  ...otherProps
}) => {
  const { enqueueSnackbar } = useSnackbar()

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
        const { id } = selectedLocation
        const { data: { _id, _source } } = await api.post('modify_point', { id, ...data })
        console.log('response: ', _id, _source)
        setSelectedLocation({ id: _id, ..._source })
        history.push(`/location/${_id}`)
        enqueueSnackbar(<Text id='notifications.markerUpdated' />, { variant: 'success' })
      } else {
        const { data: { _id, _source } } = await api.post('add_point', data)
        console.log('response: ', _id, _source)
        setSelectedLocation({ id: _id, ..._source })
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
    <LocationTab
      onSubmitLocation={(fields, editExisting) => onSubmitLocation(fields, editExisting)}
      onImageUpload={files => onImageUpload(files)}
      selectedLocation={selectedLocation}
      setSelectedLocation={location => setSelectedLocation(location)}
      closeLocationTab={closeLocationTab}
      history={history}
      {...otherProps}
    />
  )
}

export default withRouter(LocationTabContainer)
