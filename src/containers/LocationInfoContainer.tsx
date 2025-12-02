import { Helmet } from 'react-helmet'
import Loader from '../components/Loader'
import LocationInfo from '../components/LocationInfo'
import LocationPhotos from '../components/LocationPhotos'
import React from 'react'
import { activeLocationState } from '../state'
import { getPoint } from '../api/getPoint'
import { reportPoint } from '../api/reportPoint'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import { useHistory, useLocation, useParams } from 'react-router-dom'

const LocationInfoContainer: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { search } = location
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()
  const { loading: loadingAuth, isModerator, requireAuth } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (!loadingAuth) {
      if (!activeLocation) {
        const handleAsync = async () => {
          try {
            const data = await getPoint(id)
            setActiveLocation(data)
          } catch (_error) {
            setError(true)
            setLoading(false)
            toast.error(translations.connectionProblemLocation)
          }
        }
        handleAsync()
      } else {
        setLoading(false)
      }
    }
  }, [activeLocation, loadingAuth])

  const handleReport = async (fields: { reason: string; description: string }) => {
    if (!activeLocation) return
    try {
      const { reason, description } = fields
      const summary = `${translations.reportReasons[reason]}: ${description}`
      await reportPoint(activeLocation.id, summary)
      toast.success('Punkt zgłoszony do moderacji')
    } catch (err) {
      console.error(err)
      toast.error(translations.couldNotReport)
    }
  }

  const handleImageUpload = () => {
    requireAuth(() => history.push(`/location/${id}/photos`))
  }

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <>
          <Helmet>
            <title>{activeLocation?.name} | Wiating</title>
            <meta property='og:title' content={`${activeLocation?.name} | Wiating`} />
            <meta property='description' content={activeLocation?.description} />
            <meta property='og:description' content={activeLocation?.description} />
            {activeLocation?.images &&
              <meta property='og:image' content={`${process.env.FRONTEND_CDN_URL}/${activeLocation?.id}/${activeLocation.images[0]?.name.replace('.jpg', '_m.jpg')}`} />
            }
          </Helmet>
          <LocationPhotos
            location={activeLocation!}
            uploading={search === '?imageLoading=true'}
            uploadImages={handleImageUpload}
          />
          <LocationInfo
            selectedLocation={activeLocation!}
            isModerator={isModerator}
            handleReport={handleReport}
          />
        </>
  )
}

export default LocationInfoContainer
