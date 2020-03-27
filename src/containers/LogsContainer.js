import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import Logs from '../components/Logs'
import LogDetails from '../components/LogDetails'
import useAuth0 from '../utils/useAuth0'
import history from '../history'


const LogsContainer = () => {
  const { isModerator, user, loading: loadingAuth } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [logs, setLogs] = React.useState()
  const [loadingLogs, setLoadingLogs] = React.useState(true)
  const [errorLogs, setErrorLogs] = React.useState(false)
  const [loadingBan, setLoadingBan] = React.useState(false)
  const [loadingRevert, setLoadingRevert] = React.useState(false)
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const [logsTotal, setlogsTotal] = React.useState()
  const rowsPerPage = 3
  const [details, setDetails] = React.useState()

  React.useEffect(() => {
    // Invisible guarding.
    if (!loadingAuth && !isModerator) {
      history.push('/')
    }
  }, [loadingAuth])

  const getLogs = async page => {
    try {
      setLoadingLogs(true)
      const { data: { logs }, total } = await api.post('get_logs', {
        size: rowsPerPage,
        offset: rowsPerPage * page,
      })
      setLogs(logs)
      setlogsTotal(total)
    } catch (err) {
      console.error(err)
      setErrorLogs(true)
    }
    setLoadingLogs(false)
  }
  React.useEffect(() => { isModerator && getLogs(page) }, [isModerator])
  React.useEffect(() => { isModerator && getLogs(page) }, [page])

  const banCallback = async userId => {
    try {
      setLoadingBan(true)
      // await api.post('ban_user', { ban_user_id: userId })
      enqueueSnackbar('Użytkownik został zbanowany.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się zbanować użytkownika.', { variant: 'error' })
    }
    setLoadingBan(false)
  }

  const revertCallback = async (id, changed) => {
    try {
      setLoadingRevert(true)
      const dataObject = {
        id,
        ...Object.entries(changed).reduce((acc, [name, value]) => ({
          ...acc,
          [name]: value.old_value,
        }), {}),
      }
      console.log('dataObject: ', dataObject);
      await api.post('modify_point', dataObject)
      setDetails(null)
      enqueueSnackbar('Przywrócono poprzedni stan lokacji.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Nie udało się przywrocić poprzedniego stanu lokacji.', { variant: 'error' })
    }
    setLoadingRevert(false)
  }

  return (
    isModerator
      ? <>
        <Logs
          logs={logs}
          loadingLogs={loadingLogs}
          errorLogs={errorLogs}
          loadingBan={loadingBan}
          loadingRevert={loadingRevert}
          page={page}
          setPage={setPage}
          rowsInTotal={logsTotal}
          rowsPerPage={rowsPerPage}
          banCallback={banCallback}
          revertCallback={revertCallback}
          setDetails={setDetails}
        />
        {details &&
          <LogDetails
            data={details}
            banCallback={details && details.modified_by !== user.sub ? banCallback : false}
            revertCallback={revertCallback}
            loadingBan={loadingBan}
            loadingRevert={loadingRevert}
            onClose={() => setDetails(null)}
          />
        }
      </>
      : null
  )
}

export default LogsContainer
