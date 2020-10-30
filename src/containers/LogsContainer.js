import React from 'react'
import { parse, stringify } from 'querystringify'
import { withRouter } from 'react-router-dom'
import api from '../api'
import Logs from '../components/Logs'
import LogFilters from '../components/LogFilters'
import useAuth0 from '../utils/useAuth0'


const LogsContainer = ({
  setCachedLogDetails,
  location: { search },
  history,
}) => {
  const { isModerator, user } = useAuth0()
  const [logs, setLogs] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const [logsTotal, setlogsTotal] = React.useState()
  const rowsPerPage = 10
  const [filters, setFilters] = React.useState({})

  const getLogs = async page => {
    try {
      setLoading(true)
      const { data: { logs, total } } = await api.post('get_logs', {
        size: rowsPerPage,
        offset: rowsPerPage * page,
        ...filters,
      })
      setLogs(logs)
      setlogsTotal(total)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    isModerator && getLogs(page)
  }, [page, isModerator, filters])

  React.useEffect(() => {
    setFilters(parse(search))
  }, [search])

  const handleFiltersSubmit = fields => {
    const newFiltersQueryString = stringify(fields, true)
    history.push(`/moderator/log${newFiltersQueryString}`)
  }

  return (
    isModerator
      ? <>
        <LogFilters values={filters} callback={handleFiltersSubmit} />
        <Logs
          logs={logs}
          loading={loading}
          error={error}
          page={page}
          setPage={setPage}
          rowsInTotal={logsTotal}
          rowsPerPage={rowsPerPage}
          user={user}
          setDetails={data => {
            setCachedLogDetails(data)
            history.push(`/moderator/log/${data.id}${search || ''}`)
          }}
        />
      </>
      : null
  )
}

export default withRouter(LogsContainer)
