import React from 'react'
import { withRouter } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import LogDetails from '../components/LogDetails'
import Loader from '../components/Loader'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import api from '../api'


const LogDetailsContainer = ({
  cachedLogDetails,
  setCachedLogDetails,
  match: { params: { id } },
  location: { pathname },
  history,
}) => {
  const [logDetails, setLogDetails] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState()
  const [loadingBan, setLoadingBan] = React.useState(false)
  const [loadingRevert, setLoadingRevert] = React.useState(false)
  const { user, isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  // Use cached log data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (isModerator) {
      if (cachedLogDetails) {
        setLogDetails(cachedLogDetails)
        setLoading(false)
      } else {
        const handleAsync = async () => {
          try {
            const { data } = await api.post('get_log', { log_id: id })
            setLogDetails(data)
            setCachedLogDetails(data)
          } catch (error) {
            setError(true)
            enqueueSnackbar(translations.connectionProblem.logs, { variant: 'error' })
          }
          setLoading(false)
        }
        handleAsync()
      }
    }
  }, [cachedLogDetails, isModerator])

  const banCallback = async userId => {
    try {
      setLoadingBan(true)
      await api.post('ban_user', { ban_user_id: userId })
      enqueueSnackbar('Użytkownik został zbanowany.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się zbanować użytkownika.', { variant: 'error' })
    }
    setLoadingBan(false)
  }

  const revertCallback = async () => {
    try {
      setLoadingRevert(true)
      // Use another endpoint if change from given log refers to image.
      // eslint-disable-next-line camelcase
      if (logDetails.changes?.images?.new_value) {
        const dataObject = {
          id: logDetails.doc_id,
          image_name: logDetails.changes.images.new_value,
        }
        await api.post('delete_image', dataObject)
      } else {
        const dataObject = {
          id: logDetails.doc_id,
          ...Object.entries(logDetails.changes).reduce((acc, [name, value]) => ({
            ...acc,
            [name]: value.old_value,
          }), {}),
        }
        await api.post('modify_point', dataObject)
      }
      history.push('/log')
      enqueueSnackbar('Przywrócono poprzedni stan lokacji.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się przywrocić poprzedniego stanu lokacji.', { variant: 'error' })
    }
    setLoadingRevert(false)
  }

  const isMe = logDetails && logDetails.modified_by === user.sub

  return (
    loading
      ? <Loader dark big />
      : error
        ? <div>Error!</div>
        : <LogDetails
          data={logDetails}
          isMe={isMe}
          isModerator={isModerator}
          banCallback={banCallback}
          revertCallback={revertCallback}
          loadingBan={loadingBan}
          loadingRevert={loadingRevert}
          onClose={() => {
            history.push(`/${pathname.split('/')[1]}`)
            setCachedLogDetails(null)
          }}
        />
  )
}

export default withRouter(LogDetailsContainer)
