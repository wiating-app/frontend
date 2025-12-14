import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import parse from 'coord-parser'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LocationFormData, addPoint } from '../api/addPoint'
import { deletePoint } from '../api/deletePoint'
import { getPoint } from '../api/getPoint'
import { modifyPoint } from '../api/modifyPoint'
import ContentWrapper from '../components/ContentWrapper'
import Loader from '../components/Loader'
import LocationForm from '../components/LocationForm'
import { Location } from '../typings'
import { getGridCellId, removeLocationFromCacheGrid, updateCacheGridCell } from '../utils/mapGrid'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'

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

const LocationFormContainer: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams<{ id?: string }>()
  const { isModerator } = useAuth0()
  const { translations } = useLanguage()
  const queryClient = useQueryClient()

  // Check if this is a new location by checking for lat/lng query params or absence of id
  const searchParams = new URLSearchParams(location.search)
  const latParam = searchParams.get('lat')
  const lngParam = searchParams.get('lng')
  const isNew = !id || (latParam !== null && lngParam !== null)

  // If lat/lng are present, set partial location data in cache
  React.useEffect(() => {
    if (isNew && latParam && lngParam) {
      const lat = parseFloat(latParam)
      const lng = parseFloat(lngParam)
      if (!isNaN(lat) && !isNaN(lng)) {
        queryClient.setQueryData(['activeLocation'], { location: { lat, lng } } as unknown as any)
      }
    }
  }, [isNew, latParam, lngParam, queryClient])

  // Use cached location data from react-query cache
  // For forms, always fetch fresh data when editing to ensure we have the latest version
  // For new locations, it will read from cache (set by the effect above or AddButtonContainer)
  const {
    data: locationData,
    isLoading: loadingLocation,
    isError: locationError,
  } = useQuery({
    queryKey: ['activeLocation'],
    queryFn: () => (id ? getPoint(id) : null),
  })

  // Make sure that form is cleaned up eg. when navigating from edit location
  // form to new location form.
  React.useEffect(() => {
    if (isNew) {
      toast.dismiss() // It is here only to dismiss the persising "Put point on map" snackbar.
    }
  }, [isNew])

  const addPointMutation = useMutation({
    mutationFn: (data: LocationFormData) => addPoint(data),
    onSuccess: data => {
      queryClient.setQueryData(['activeLocation'], data)
      updateCacheGridCell(queryClient, data)
      history.push(`/location/${data.id}`)
      toast.success(translations.newMarkerAdded)
    },
    onError: (error: any) => {
      if (error.type === 'parseError') {
        console.error(error.value)
        toast.error(translations.wrongCoordsFormat)
      } else {
        console.error(error)
        toast.error(translations.couldNotSaveMarker)
      }
    },
  })

  const modifyPointMutation = useMutation({
    mutationFn: ({ id: locationId, data }: { id: string | number; data: LocationFormData }) =>
      modifyPoint(locationId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['activeLocation'], data)

      // Get old location data to check if cell changed or for removal
      const oldLocation = locationData

      if (oldLocation?.location) {
        // If location is unpublished and user is not a moderator, remove from cache
        if (data.unpublished && !isModerator) {
          removeLocationFromCacheGrid(queryClient, oldLocation)
          history.push(`/location/${variables.id}`)
          toast.success(translations.markerUpdated)
          return
        }

        // Otherwise, check if cell changed and update cache
        const oldCellId = getGridCellId(oldLocation.location.lat, oldLocation.location.lng)
        const newCellId = getGridCellId(data.location.lat, data.location.lng)
        // If cell changed, remove from old cell
        if (oldCellId !== newCellId) {
          removeLocationFromCacheGrid(queryClient, oldLocation)
        }
      }

      // Update or add to the new cell
      updateCacheGridCell(queryClient, data)
      history.push(`/location/${variables.id}`)
      toast.success(translations.markerUpdated)
    },
    onError: (error: any) => {
      if (error.type === 'parseError') {
        console.error(error.value)
        toast.error(translations.wrongCoordsFormat)
      } else {
        console.error(error)
        toast.error(translations.couldNotSaveMarker)
      }
    },
  })

  const deletePointMutation = useMutation({
    mutationFn: (pointId: string) => deletePoint(pointId),
    onSuccess: () => {
      if (id && locationData) {
        // Remove from cacheGrid before removing activeLocation
        removeLocationFromCacheGrid(queryClient, locationData)
        queryClient.removeQueries({ queryKey: ['activeLocation'] })
        history.push('/')
        toast.success(translations.locationDeleted)
      }
    },
    onError: () => {
      toast.error(translations.couldNotDeleteLocation)
    },
  })

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

  const onSubmitLocation = (fields: LocationFormFields) => {
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
      const { lat, lon } = parse(location)
      const dataObject: LocationFormData = {
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
        addPointMutation.mutate(dataObject)
      } else {
        // Updating existing marker.
        if (!id || !locationData) return
        modifyPointMutation.mutate({ id, data: dataObject })
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

  const onDeleteLocation = () => {
    if (!id) return
    deletePointMutation.mutate(id)
  }

  return (
    <ContentWrapper>
      {loadingLocation ? (
        <Loader dark big />
      ) : locationError ? (
        <div>Error!</div>
      ) : (
        <LocationForm
          locationData={locationData}
          onSubmitLocation={onSubmitLocation}
          onCorodinatesChange={(coords: string) => {
            try {
              const { lat, lon } = parse(coords)
              if (
                typeof lat !== 'undefined' &&
                typeof lon !== 'undefined' &&
                (locationData?.location?.lat !== lat || locationData?.location?.lng !== lon)
              ) {
                const updatedLocation = { ...locationData, location: { lat, lng: lon } } as Location
                queryClient.setQueryData(['activeLocation'], updatedLocation)
              }
            } catch (err) {
              console.error(err)
            }
          }}
          cancel={() => {
            if (locationData?.id) {
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
