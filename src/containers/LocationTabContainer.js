import React from 'react'
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

  const onSubmitLocation = async fields => {
    const { lat, lon } = selectedLocation
    const data = {
      ...fields,
      lat,
      lon,
    }

    if (content === 'editMarker') {
      await api.updatePoint({ id: selectedLocation.id, ...data })
      closeLocationTab()
    } else {
      await api.addPoint(data)
      closeLocationTab()
    }
    setLocationTabContent('markerInfo')

    refreshMap()
  }

  const onImageUpload = async files => {
    await api.uploadImages(this.props.selectedLocation, files)

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
