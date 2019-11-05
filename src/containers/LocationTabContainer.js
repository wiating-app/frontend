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
  ...otherProps
}) => {
  const { isLoggedIn } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()

  const onSubmitLocation = async (fields, editExisting) => {
    const { lat, lon } = selectedLocation.location
    const data = {
      ...fields,
      water_exists: fields.water_exists || false,
      fire_exists: fields.fire_exists || false,
      lat,
      lon,
    }
    console.log('data: ', data)

    try {
      if (editExisting) {
        const { id } = selectedLocation
        const { data: { body } } = await api.post('modify_point', { id, ...data })
        console.log('response: ', body)
        enqueueSnackbar('Marker zaktualizowany', { variant: 'success' })
      } else {
        const { data: { body } } = await api.post('add_point', data)
        console.log('response: ', body)
        enqueueSnackbar('Dodano nowy marker', { variant: 'success' })
      }
      setLocationTabContent('markerInfo')
      refreshMap()
    } catch (error) {
      console.log('error: ', error)
      enqueueSnackbar('Nie udało się zapisać markera.', { variant: 'error' })
    }
  }

  const onImageUpload = async files => {
    const data = new FormData()
    data.append('file', files[0])
    await api.post(`add_image/${selectedLocation.id}`, files)
    refreshMap()
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
