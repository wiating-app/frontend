import React from 'react'
import { banUser } from '../api/banUser'
import { getLog } from '../api/getLog'
import { logReviewed } from '../api/logReviewed'
import { revertLog } from '../api/revertLog'
import Loader from '../components/Loader'
import LogDetails from '../components/LogDetails'
import Modal from '../components/Modal'
import { LogDetails as LogDetailsType, LogSource } from '../typings'
import useAuth0 from '../utils/useAuth0'
import useLanguage from '../utils/useLanguage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const LogDetailsContainer: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { search, pathname } = useLocation()
  const [loadingReview, setLoadingReview] = React.useState(false)
  const [loadingBan, setLoadingBan] = React.useState(false)
  const [loadingRevert, setLoadingRevert] = React.useState(false)
  const queryClient = useQueryClient()
  const { user, isModerator } = useAuth0()
  const { translations } = useLanguage()

  const {
    data: logDetails,
    isLoading,
    isError,
  } = useQuery<LogDetailsType>({
    queryKey: ['logs', 'detail', id!],
    queryFn: () => getLog(id!),
    enabled: !!id && isModerator,
  })

  React.useEffect(() => {
    if (isError) {
      toast.error(translations.connectionProblemLogs)
    }
  }, [isError, translations.connectionProblemLogs])

  const goBackToLogs = (invalidate?: boolean) => {
    const pathArray = pathname.split('/')
    if (invalidate) {
      queryClient.invalidateQueries({ queryKey: ['logs', 'list'] })
    }
    history.push({
      pathname: `/${pathArray[1]}/${pathArray[2]}`,
      search,
    })
  }

  const reviewCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingReview(true)
      const data = await logReviewed(logDetails._id)
      // Update the log details cache
      queryClient.setQueryData(['logs', 'detail', logDetails._id], data)
      // Invalidate all logs list queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['logs', 'list'] })
      goBackToLogs()
      toast.success('Log zweryfikowany.')
    } catch (err) {
      console.error(err)
      toast.error('Błąd bazy danych!')
    }
    setLoadingReview(false)
  }

  const banCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingBan(true)
      await banUser(logDetails._source.modified_by)
      toast.success('Autor zmiany został zbanowany.')
    } catch (err) {
      console.error(err)
      toast.error('Nie udało się zbanować użytkownika.')
    }
    setLoadingBan(false)
  }

  const revertCallback = async () => {
    if (!logDetails) return
    try {
      setLoadingRevert(true)
      await revertLog(logDetails)
      // Invalidate logs list to refetch after revert
      queryClient.invalidateQueries({ queryKey: ['logs', 'list'] })
      goBackToLogs(true)
      toast.success('Przywrócono poprzedni stan lokacji.')
    } catch (err) {
      console.error(err)
      toast.error('Nie udało się przywrocić poprzedniego stanu lokacji.')
    }
    setLoadingRevert(false)
  }

  const isMe = logDetails && (logDetails._source as LogSource).modified_by === user?.sub

  return (
    <Modal
      short
      onClose={() => {
        goBackToLogs()
      }}
    >
      {isLoading ? (
        <Loader dark big centered />
      ) : isError ? (
        <div>Error!</div>
      ) : (
        logDetails && (
          <LogDetails
            data={logDetails._source}
            isMe={isMe || false}
            isModerator={isModerator}
            user={user}
            reviewCallback={reviewCallback}
            banCallback={banCallback}
            revertCallback={revertCallback}
            loadingReview={loadingReview}
            loadingBan={loadingBan}
            loadingRevert={loadingRevert}
          />
        )
      )}
    </Modal>
  )
}

export default LogDetailsContainer
