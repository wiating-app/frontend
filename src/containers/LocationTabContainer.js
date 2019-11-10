import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import { useAuth0 } from '../auth0'
import LocationTab from '../components/LocationTab'


const LocationTabContainer = ({
  content,
  selectedLocation,
  refreshMap,
  closeLocationTab,
  setLocationTabContent,
  ...otherProps
}) => {
  const { isLoggedIn } = useAuth0()
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
        const { data: response } = await api.post('modify_point', { id, ...data })
        console.log('response: ', response)
        enqueueSnackbar('Marker zaktualizowany', { variant: 'success' })
      } else {
        const { data: response } = await api.post('add_point', data)
        console.log('response: ', response)
        enqueueSnackbar('Dodano nowy marker', { variant: 'success' })
      }
      setLocationTabContent('markerInfo')
      refreshMap()
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Nie udało się zapisać markera.', { variant: 'error' })
    }
  }

  const onImageUpload = async files => {
    try {
      const data = new FormData()
      data.append('file', files[0])
      await api.post(`add_image/${selectedLocation.id}`, data)
      refreshMap()
      enqueueSnackbar('Dodano nowe zdjęcie.', { variant: 'success' })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Nie udało się zapisać zdjęcia.', { variant: 'error' })
    }
  }

  return (
    <LocationTab
      loggedIn={isLoggedIn}
      onSubmitLocation={(fields, editExisting) => onSubmitLocation(fields, editExisting)}
      onImageUpload={files => onImageUpload(files)}
      selectedLocation={selectedLocation}
      content={content}
      closeLocationTab={closeLocationTab}
      {...otherProps}
    />
  )
}

export default LocationTabContainer
