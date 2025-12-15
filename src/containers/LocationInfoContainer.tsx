import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getPoint } from '../api/getPoint'
import { reportPoint } from '../api/reportPoint'
import Loader from '../components/Loader'
import LocationInfo from '../components/LocationInfo'
import LocationPhotos from '../components/LocationPhotos'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'

const LocationInfoContainer: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { search } = location
  const { translations } = useLanguage()
  const { isModerator, requireAuth } = useAuth0()

  const {
    data: locationData,
    isLoading: loadingLocation,
    isError: locationError,
  } = useQuery({
    queryKey: ['activeLocation'],
    queryFn: () => getPoint(id!),
    enabled: !!id,
  })

  // Show error toast when query fails
  React.useEffect(() => {
    if (locationError) {
      toast.error(translations.connectionProblemLocation)
    }
  }, [locationError, translations.connectionProblemLocation])

  const reportMutation = useMutation({
    mutationFn: ({ locationId, summary }: { locationId: string | number; summary: string }) =>
      reportPoint(locationId, summary),
    onSuccess: () => {
      toast.success('Punkt zgłoszony do moderacji')
    },
    onError: () => {
      toast.error(translations.couldNotReport)
    },
  })

  const handleReport = (fields: { reason: string; description: string }) => {
    if (!locationData) return
    const { reason, description } = fields
    const summary = `${translations.reportReasons[reason]}: ${description}`
    reportMutation.mutate({ locationId: locationData.id, summary })
  }

  const handleImageUpload = () => {
    requireAuth(() => history.push(`/location/${id}/photos`))
  }

  if (loadingLocation) {
    return <Loader big />
  }

  if (locationError || !locationData) {
    return <div>Error!</div>
  }

  return (
    <>
      <Helmet>
        <title>{locationData.name || 'Location'} | Wiating</title>
        <meta property="og:title" content={`${locationData.name || 'Location'} | Wiating`} />
        <meta property="description" content={locationData.description || ''} />
        <meta property="og:description" content={locationData.description || ''} />
        {locationData.images && locationData.images[0] && (
          <meta
            property="og:image"
            content={`${process.env.FRONTEND_CDN_URL}/${locationData.id}/${locationData.images[0]?.name.replace('.jpg', '_m.jpg')}`}
          />
        )}
      </Helmet>
      <LocationPhotos
        location={locationData}
        uploading={search === '?imageLoading=true'}
        uploadImages={handleImageUpload}
      />
      <LocationInfo selectedLocation={locationData} isModerator={isModerator} handleReport={handleReport} />
    </>
  )
}

export default LocationInfoContainer
