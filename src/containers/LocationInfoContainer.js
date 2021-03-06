import React from 'react'
import { withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { useSnackbar } from 'notistack'
import api from '../api'
import { activeLocationState } from '../state'
import useAuth0 from '../utils/useAuth0'
import LocationPhotos from '../components/LocationPhotos'
import LocationInfo from '../components/LocationInfo'
import Loader from '../components/Loader'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'


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
