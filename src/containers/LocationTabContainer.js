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

  const onSubmitLocation = async fields => {
    const { lat, lon } = selectedLocation
    const data = {
      ...fields,
      lat,
      lon,
    }

    try {
      if (content === 'editMarker') {
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
      enqueueSnackbar('Nie udało się zapisać markera. Błąd bazy.', { variant: 'error' })
    }
  }

  const onImageUpload = async files => {
    await api.uploadImages(selectedLocation, files)
    setLocationTabContent('markerInfo')
    refreshMap()
  }

  return (
    <LocationTab
      loggedIn={isLoggedIn}
      onSubmitLocation={fields => onSubmitLocation(fields)}
      onImageUpload={files => onImageUpload(files)}
      selectedLocation={selectedLocation}
      content={content}
      closeLocationTab={closeLocationTab}
      {...otherProps}
    />
  )
}

export default LocationTabContainer
