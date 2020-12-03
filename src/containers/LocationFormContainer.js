import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import { withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import parse from 'coord-parser'
import { activeLocationState, markersState } from '../state'
import ContentWrapper from '../components/ContentWrapper'
import LocationForm from '../components/LocationForm'
import Loader from '../components/Loader'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'
import serializeData from '../utils/serializeData'


const LocationFormContainer = ({
  isNew,
  history,
  match,
}) => {
  const { params: { id } } = match
  const { isLoggedIn, loading: loadingAuth, isModerator } = useAuth0()
  const { translations } = useLanguage()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const [markers, setMarkers] = useRecoilState(markersState)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  React.useEffect(() => {
    if (!loadingAuth && !isLoggedIn) {
      history.push(`/location/${id}`)
      enqueueSnackbar('Dodawanie lub edycja lokalizacji wymaga bycia zalogowanym.', { variant: 'warning' })
    }
  }, [loadingAuth])

  // Make sure that form is cleaned up eg. when navigating from edit location
  // form to new location form.
  React.useEffect(() => {
    if (isNew) {
      closeSnackbar() // It is here only to dismiss the persising "Put point on map" snackbar.
      const handleAsync = async () => {
        setLoading(true)
        setLoading(false)
      }
      handleAsync()
    }
  }, [isNew])

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (!isNew) {
      if (!activeLocation && id) {
        const handleAsync = async () => {
          try {
            const { data } = await api.post('get_point', { id })
            setActiveLocation(serializeData(data))
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

  // Convert Select option to bool. undefined = null, 1 = true, 2 = false.
  const mapOptionToBool = value => {
    switch (value) {
      case 1:
        return true
      case 2:
        return false
      default:
        return null
    }
  }

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
      is_disabled,
    } = fields

    try {
      const { lat, lon } = parse(location)
      const dataObject = {
        name,
        description,
        directions,
        lat,
        lon,
        type,
        water_exists: mapOptionToBool(water_exists),
        water_comment: water_exists && water_comment ? water_comment : null,
        fire_exists: mapOptionToBool(fire_exists),
        fire_comment: fire_exists && fire_comment ? fire_comment : null,
        is_disabled: is_disabled || false,
      }

      if (isNew) {
        // New marker creation.
        const { data } = await api.post('add_point', dataObject)
        const serializedData = serializeData(data)
        const newMarkers = [...markers, serializedData]
        setMarkers(newMarkers)
        setActiveLocation(serializedData)
        history.push(`/location/${data.id}`)
        enqueueSnackbar(translations.notifications.newMarkerAdded, { variant: 'success' })
      } else {
        // Updating exisitng marker.
        const { id } = activeLocation
        const { data } = await api.post('modify_point', { id, ...dataObject })
        const serializedData = serializeData(data)
        const index = markers.findIndex(item => item.id === serializedData.id)
        const newMarkers = [
          ...markers.slice(0, index),
          serializedData,
          ...markers.slice(index + 1),
        ]
        setMarkers(newMarkers)
        setActiveLocation(serializedData)
        history.push(`/location/${id}`)
        enqueueSnackbar(translations.notifications.markerUpdated, { variant: 'success' })
      }
    } catch (error) {
      if (error.type === 'parseError') {
        console.error(error.value)
        enqueueSnackbar(translations.notifications.wrongCoordsFormat, { variant: 'error' })
      } else {
        console.error(error)
        enqueueSnackbar(translations.notifications.couldNotSaveMarker, { variant: 'error' })
      }
    }
  }

  const onDeleteLocation = async () => {
    try {
      await api.post('delete_point', { id })
      history.push('/')
      setActiveLocation(null)
      setMarkers(markers.filter(item => item.id !== id))
      enqueueSnackbar(translations.notifications.locationDeleted, { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(translations.notifications.couldNotDeleteLocation, { variant: 'error' })
    }
  }

  return (
    <ContentWrapper>
      {loading || loadingAuth
        ? <Loader dark big />
        : error
          ? <div>Error!</div>
          : <LocationForm
            locationData={location}
            onSubmitLocation={onSubmitLocation}
            updateCurrentMarker={coords => {
              try {
                const { lat, lon } = parse(coords)
                if (
                  (typeof lat !== 'undefined' && typeof lat !== 'undefined') &&
                  (!location?.location || location.location.lat !== lat || location.location.lon !== lon)
                ) {
                  setCachedLocation({ ...location, location: { lat, lon } })
                }
              } catch (err) {}
            }}
            cancel={() => {
              if (location?.id) {
                history.goBack()
              } else {
                history.push('/')
              }
            }}
            isModerator={isModerator}
            onDeleteLocation={onDeleteLocation}
            isNew={isNew}
          />
      }
    </ContentWrapper>
  )
}

export default withRouter(LocationFormContainer)
