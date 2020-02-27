import React from 'react'
import api from '../api'
import Logs from '../components/Logs'
import { useAuth0 } from '../utils/auth0Provider'


const LogsContainer = () => {
  const { isModerator } = useAuth0()
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const [logs, setLogs] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const rowsPerPage = 3

  const getLogs = async page => {
    try {
      setLoading(true)
      const { data: { logs } } = await api.post('get_logs', {
        size: rowsPerPage,
        offset: rowsPerPage * page,
      })
      setLogs(logs)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    isModerator && getLogs(page)
  }, [isModerator])

  React.useEffect(() => {
    isModerator && getLogs(page)
  }, [page])

  const rowsInTotal = 20
  return (
    isModerator
      ? <Logs
        data={logs}
        loading={loading}
        error={error}
        page={page}
        setPage={setPage}
        rowsInTotal={rowsInTotal}
        rowsPerPage={rowsPerPage}
      />
      : null
  )
}

export default LogsContainer
