import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import Logs from '../components/Logs'
import Text from '../components/Text'
import Loader from '../components/Loader'
import { useAuth0 } from '../utils/auth0Provider'


const LogsContainer = () => {
  const { isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const [logs, setLogs] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const rowsPerPage = 3

  const getLogs = async () => {
    const offset = rowsPerPage * page
    const size = rowsPerPage
    try {
      const { data: { logs } } = await api.post('get_logs')
      setLogs(logs)
      setLoading(false)
    } catch (err) {
      console.error(err)
      enqueueSnackbar(<Text id='connectionProblem.logs' />, { variant: 'error' })
      setLoading(false)
      setError(true)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    isModerator && getLogs()
  }, [isModerator])

  const rowsInTotal = 20
  return (
    isModerator && !loading && !error
      ? <Logs
        data={logs}
        page={page}
        setPage={setPage}
        rowsInTotal={rowsInTotal}
        rowsPerPage={rowsPerPage}
      />
      : null
  )
}

export default LogsContainer
