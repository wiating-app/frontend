import { Helmet } from 'react-helmet'
import Loader from '../components/Loader'
import LocationInfo from '../components/LocationInfo'
import LocationPhotos from '../components/LocationPhotos'
import React from 'react'
import { activeLocationState } from '../state'
import api from '../api'
import serializeData from '../utils/serializeData'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import { withRouter } from 'react-router-dom'

const LocationInfoContainer = ({
  match: { params: { id } },
  location: { search },
  history,
}) => {
  const [activeLocation, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()
  const { isLoggedIn, loading: loadingAuth, isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()

  // Use cached location data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (!loadingAuth) {
      if (!activeLocation) {
        const handleAsync = async () => {
          try {
            const { data } = await api.post('get_point', { id })
            setActiveLocation(serializeData(data))
          } catch (error) {
            setError(true)
            setLoading(false)
            enqueueSnackbar(translations.connectionProblem.location, { variant: 'error' })
          }
        }
        handleAsync()
      } else {
        setLoading(false)
      }
    }
  }, [activeLocation, loadingAuth])

  const handleReport = async fields => {
    try {
      const { reason, description } = fields
      const summary = `${translations.reportReasons[reason]}: ${description}`
      await api.post('report', {
        id: activeLocation.id,
        report_reason: summary,
      })
      enqueueSnackbar('Punkt zgłoszony do moderacji', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar(translations.notifications.couldNotReport, { variant: 'error' })
    }
  }

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <>
          <Helmet>
            <title>{activeLocation.name} | Wiating</title>
            <meta property='og:title' content={activeLocation.name} />
            <meta property='og:description' content={activeLocation.description} />
            {activeLocation.images &&
              <meta property='og:image' content={`${process.env.FRONTEND_CDN_URL}/${activeLocation?.id}/${activeLocation.images[0]?.name.replace('.jpg', '_m.jpg')}`} />
            }
          </Helmet>
          <LocationPhotos
            location={activeLocation}
            uploading={search === '?imageLoading=true'}
            uploadImages={() => history.push(`/location/${id}/photos`)}
          />
          <LocationInfo
            selectedLocation={activeLocation}
            loggedIn={isLoggedIn}
            isModerator={isModerator}
            handleReport={handleReport}
          />
        </>
  )
}

export default withRouter(LocationInfoContainer)
