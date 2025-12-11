import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { toast } from 'sonner'
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

const LogDetailsContainer: React.FC = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { search, pathname } = useLocation()
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

  const reviewMutation = useMutation({
    mutationFn: (logId: string) => logReviewed(logId),
    onSuccess: (data, logId) => {
      // Update the log details cache
      queryClient.setQueryData(['logs', 'detail', logId], data)
      // Invalidate all logs list queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['logs', 'list'] })
      goBackToLogs()
      toast.success('Log zweryfikowany.')
    },
    onError: () => {
      toast.error('Błąd bazy danych!')
    },
  })

  const banMutation = useMutation({
    mutationFn: (userId: string) => banUser(userId),
    onSuccess: () => {
      toast.success('Autor zmiany został zbanowany.')
    },
    onError: () => {
      toast.error('Nie udało się zbanować użytkownika.')
    },
  })

  const revertMutation = useMutation({
    mutationFn: (logDetails: LogDetailsType) => revertLog(logDetails),
    onSuccess: () => {
      // Invalidate logs list to refetch after revert (with small delay to give backend time to process)
      // TODO: Ensure that backend returns 200 only after ensuring that db update has really finished.
      // This workaround may introduce a race condition.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['logs', 'list'] })
      }, 1000)
      goBackToLogs(true)
      toast.success('Przywrócono poprzedni stan lokacji.')
    },
    onError: () => {
      toast.error('Nie udało się przywrocić poprzedniego stanu lokacji.')
    },
  })

  const reviewCallback = () => {
    if (!logDetails) return
    reviewMutation.mutate(logDetails._id)
  }

  const banCallback = () => {
    if (!logDetails) return
    banMutation.mutate(logDetails._source.modified_by)
  }

  const revertCallback = () => {
    if (!logDetails) return
    revertMutation.mutate(logDetails)
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
            loadingReview={reviewMutation.isPending}
            loadingBan={banMutation.isPending}
            loadingRevert={revertMutation.isPending}
          />
        )
      )}
    </Modal>
  )
}

export default LogDetailsContainer
