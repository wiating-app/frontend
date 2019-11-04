import React from 'react'
import { useSnackbar } from 'notistack'
import { API } from '../api'
import { useAuth0 } from '../auth0'
import LocationTab from '../components/LocationTab'

const api = new API()

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
      lat,
      lon,
    }
    console.log('data: ', data)

    try {
      if (editExisting) {
        const response = await api.updatePoint({ id: selectedLocation.id, ...data })
        console.log('response: ', response)
        enqueueSnackbar('Marker zaktualizowany', { variant: 'success' })
      } else {
        const response = await api.addPoint(data)
        console.log('response: ', response)
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
    console.log('files: ', files)
    // await api.uploadImages(selectedLocation.id, files)
    // refreshMap()
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
