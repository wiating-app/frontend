import React from 'react'
import parse from 'coord-parser'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import { addPoint } from '../api/addPoint'
import { deletePoint } from '../api/deletePoint'
import { getPoint } from '../api/getPoint'
import { modifyPoint } from '../api/modifyPoint'
import ContentWrapper from '../components/ContentWrapper'
import Loader from '../components/Loader'
import LocationForm from '../components/LocationForm'
import { activeLocationState, markersState } from '../state'
import { Location } from '../typings'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'

interface LocationFormContainerProps {
  isNew?: boolean
}

interface LocationFormFields {
  name: string
  description?: string
  directions?: string
  type?: string | number
  location: string
  water_exists?: number
  water_comment?: string
  fire_exists?: number
  fire_comment?: string
  is_disabled?: boolean
  unpublished?: boolean
}

const LocationFormContainer: React.FC<LocationFormContainerProps> = ({ isNew }) => {
  const history = useHistory()
  const { id } = useParams<{ id?: string }>()
  const { isLoggedIn, loading: loadingAuth, isModerator } = useAuth0()
  const { translations } = useLanguage()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [markers, setMarkers] = useRecoilState(markersState)

  React.useEffect(() => {
    if (!loadingAuth) {
      if (!isLoggedIn) {
        history.push(`/location/${id}`)
        toast.warning('Dodawanie lub edycja lokalizacji wymaga bycia zalogowanym.')
      }
      // Use cached location data if avaliable, otherwise load data from endpoint.
      // Do it after authentication check to provide bearer token in api request.
      if (!isNew) {
        if (!activeLocation && id) {
          const handleAsync = async () => {
            try {
              const data = await getPoint(id)
              setActiveLocation(data)
            } catch (_error) {
              setError(true)
            }
            setLoading(false)
          }
          handleAsync()
        } else {
          setLoading(false)
        }
      }
    }
  }, [loadingAuth])

  // Make sure that form is cleaned up eg. when navigating from edit location
  // form to new location form.
  React.useEffect(() => {
    if (isNew) {
      toast.dismiss() // It is here only to dismiss the persising "Put point on map" snackbar.
      const handleAsync = async () => {
        setLoading(true)
        setLoading(false)
      }
      handleAsync()
    }
  }, [isNew])

  // Convert Select option to bool. undefined = null, 1 = true, 2 = false.
  const mapOptionToBool = (value?: number): boolean | null => {
    switch (value) {
      case 1:
        return true
      case 2:
        return false
      default:
        return null
    }
  }

  const onSubmitLocation = async (fields: LocationFormFields) => {
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
      is_disabled,
      unpublished,
    } = fields

    try {
      console.log('location: ', location)
      const { lat, lon } = parse(location)
      console.log('lon: ', lon)
      console.log('lat: ', lat)
      const dataObject = {
        name,
        description,
        directions,
        location: { lat, lon },
        type,
        water_exists: mapOptionToBool(water_exists),
        water_comment: water_exists && water_comment ? water_comment : null,
        fire_exists: mapOptionToBool(fire_exists),
        fire_comment: fire_exists && fire_comment ? fire_comment : null,
        is_disabled: is_disabled || false,
        unpublished: unpublished || false,
      }

      if (isNew) {
        // New marker creation.
        const data = await addPoint(dataObject)
        const newMarkers = [...markers, data]
        setMarkers(newMarkers)
        setActiveLocation(data)
        history.push(`/location/${data.id}`)
        toast.success(translations.newMarkerAdded)
      } else {
        // Updating exisitng marker.
        const { id: locationId } = activeLocation!
        const data = await modifyPoint(locationId, dataObject)
        const index = markers.findIndex((item: any) => item.id === data.id)
        const newMarkers = [...markers.slice(0, index), data, ...markers.slice(index + 1)]
        setMarkers(newMarkers)
        setActiveLocation(data)
        history.push(`/location/${locationId}`)
        toast.success(translations.markerUpdated)
      }
    } catch (error: any) {
      if (error.type === 'parseError') {
        console.error(error.value)
        toast.error(translations.wrongCoordsFormat)
      } else {
        console.error(error)
        toast.error(translations.couldNotSaveMarker)
      }
    }
  }

  const onDeleteLocation = async () => {
    if (!id) return
    try {
      await deletePoint(id)
      history.push('/')
      setActiveLocation(null)
      setMarkers(markers.filter((item: any) => item.id !== id) as Location[])
      toast.success(translations.locationDeleted)
    } catch (err) {
      console.error(err)
      toast.error(translations.couldNotDeleteLocation)
    }
  }

  return (
    <ContentWrapper>
      {loading || loadingAuth ? (
        <Loader dark big />
      ) : error ? (
        <div>Error!</div>
      ) : (
        <LocationForm
          locationData={activeLocation}
          onSubmitLocation={onSubmitLocation}
          updateCurrentMarker={(coords: string) => {
            try {
              const { lat, lon } = parse(coords)
              if (
                typeof lat !== 'undefined' &&
                typeof lon !== 'undefined' &&
                (!activeLocation?.location ||
                  activeLocation.location.lat !== lat ||
                  activeLocation.location.lng !== lon)
              ) {
                setActiveLocation({ ...activeLocation, location: { lat, lng: lon } } as Location)
              }
            } catch (err) {
              console.error(err)
            }
          }}
          cancel={() => {
            if (activeLocation?.id) {
              history.goBack()
            } else {
              history.push('/')
            }
          }}
          isModerator={isModerator}
          onDeleteLocation={onDeleteLocation}
          isNew={isNew}
        />
      )}
    </ContentWrapper>
  )
}

export default LocationFormContainer
