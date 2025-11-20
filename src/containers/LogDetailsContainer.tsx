import React from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { useRecoilState } from 'recoil'
import Modal from '../components/Modal'
import LogDetails from '../components/LogDetails'
import Loader from '../components/Loader'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { getLog } from '../api/getLog'
import { logReviewed } from '../api/logReviewed'
import { banUser } from '../api/banUser'
import { revertLog } from '../api/revertLog'
import { logsState, logDetailsState } from '../state'
import { Log, LogDetails as LogDetailsType, LogSource } from '../typings'

const LogDetailsContainer: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { search, pathname } = location
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [loadingReview, setLoadingReview] = React.useState(false)
  const [loadingBan, setLoadingBan] = React.useState(false)
  const [loadingRevert, setLoadingRevert] = React.useState(false)
  const [logDetails, setLogDetails] = useRecoilState(logDetailsState)
  const [logs, setLogs] = useRecoilState(logsState)
  const { user, isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  // Use cached log data if avaliable, otherwise load data from endpoint.
  React.useEffect(() => {
    if (isModerator) {
      if (!logDetails) {
        const handleAsync = async () => {
          try {
            const data = await getLog(id)
            setLogDetails(data)
          } catch (error) {
            setError(true)
            setLoading(false)
            enqueueSnackbar(translations.connectionProblemLogs, { variant: 'error' })
          }
        }
        handleAsync()
      } else {
        setLoading(false)
      }
    }
  }, [logDetails, isModerator])

  const goBackToLogs = (refetch?: boolean) => {
    const pathArray = pathname.split('/')
    history.push({
      pathname: `/${pathArray[1]}/${pathArray[2]}`,
      search: `${search}${refetch ? '&refetchLogs=true' : ''}`,
    })
  }

  const reviewCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingReview(true)
      const data = await logReviewed(logDetails._id)
      // If reviewed filter is set to false, filter reviewed item out of a list.
      // Otherwise just update its state.
      if (search.includes('reviewed_at=false')) {
        const newLogs = logs.filter((item: Log) => item._id !== logDetails._id)
        setLogs(newLogs)
      } else {
        const index = logs.findIndex((item: Log) => item._id === logDetails._id)
        const newLogs = [
          ...logs.slice(0, index),
          data,
          ...logs.slice(index + 1),
        ]
        setLogs(newLogs)
      }
      goBackToLogs()
      enqueueSnackbar('Log zweryfikowany.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Błąd bazy danych!', { variant: 'error' })
    }
    setLoadingReview(false)
  }

  const banCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingBan(true)
      await banUser(logDetails._source.modified_by)
      enqueueSnackbar('Autor zmiany został zbanowany.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się zbanować użytkownika.', { variant: 'error' })
    }
    setLoadingBan(false)
  }

  const revertCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingRevert(true)
      await revertLog(logDetails)
      goBackToLogs(true)
      enqueueSnackbar('Przywrócono poprzedni stan lokacji.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się przywrocić poprzedniego stanu lokacji.', { variant: 'error' })
    }
    setLoadingRevert(false)
  }

  const isMe = logDetails && (logDetails._source as LogSource).modified_by === user?.sub

  return (
    <Modal short onClose={() => {
      goBackToLogs()
      setLogDetails(null)
    }}>
      {loading
        ? <Loader dark big />
        : error
          ? <div>Error!</div>
          : <LogDetails
            data={logDetails!._source}
            isMe={isMe || false}
            isModerator={isModerator}
            reviewCallback={reviewCallback}
            banCallback={banCallback}
            revertCallback={revertCallback}
            loadingReview={loadingReview}
            loadingBan={loadingBan}
            loadingRevert={loadingRevert}
          />
      }
    </Modal>
  )
}

export default LogDetailsContainer

