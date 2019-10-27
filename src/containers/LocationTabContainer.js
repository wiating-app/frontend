import React from 'react'
import { useAuth0 } from '../react-auth0-wrapper'
import LocationTab from '../components/LocationTab'


const LocationTabContainer = ({
  content,
  selectedLocation,
  refreshMap,
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
    } else {
      await api.addPoint(data)
    }

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
      {...otherProps}
    />
  )
}

export default LocationTabContainer
