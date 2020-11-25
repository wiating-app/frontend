import React from 'react'
import { parse, stringify } from 'querystringify'
import { withRouter } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import api from '../api'
import Logs from '../components/Logs'
import LogFilters from '../components/LogFilters'
import useAuth0 from '../utils/useAuth0'
import { cachedLogDetailsState } from '../state'

/* eslint-disable camelcase */

const LogsContainer = ({
  location: { search, pathname },
  history,
}) => {
  const { isModerator, user } = useAuth0()
  const [logs, setLogs] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [logsTotal, setlogsTotal] = React.useState()
  const [params, setParams] = React.useState({
    ...parse(search),
    page: 0, // Page numeration starts at 0.
    size: 10, // Rows per page.
  })
  const [, setCachedLogDetails] = useRecoilState(cachedLogDetailsState)

  const getLogs = async () => {
    try {
      setLoading(true)
      const { page, size, id, reviewed_at } = params
      const { data: { logs, total } } = await api.post('get_logs', {
        size,
        offset: size * page,
        id,
        reviewed_at,
      })
      setLogs(logs)
      setlogsTotal(total)
      // }
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    isModerator && getLogs()
  }, [isModerator, params])

  const updateSearch = newParams => {
    const newFiltersQueryString = stringify({
      ...params,
      ...newParams,
    }, true)
    history.replace(`/moderator/log${newFiltersQueryString}`)
  }

  // Parse search.
  React.useEffect(() => {
    const { page, size, id, reviewed_at, refetchLogs } = parse(search)
    setParams(prevState => {
      // If refetchLogs param is present, remove it.
      // A presence of refetchLogs param updates the `params` object,
      // so getLogs function is being triggered automatically by useEffect hook.
      if (refetchLogs) {
        history.replace({
          pathname,
          search: search.replace('&refetchLogs=true', ''),
        })
        return prevState
      } else {
        return {
          page: parseInt(page) || prevState.page,
          size: parseInt(size) || prevState.size,
          ...id && { id },
          ...reviewed_at && { reviewed_at: JSON.parse(reviewed_at) },
        }
      }
    })
  }, [search])

  const handleFitlersSubmit = fields => {
    updateSearch({
      ...fields,
      page: 0, // Reset paginagion when filters change.
    })
  }

  return (
    isModerator
      ? <>
        <LogFilters
          values={params}
          handleSubmit={handleFitlersSubmit}
          handleReset={() => history.replace({ pathname })}
        />
        <Logs
          logs={logs}
          loading={loading}
          error={error}
          page={params.page}
          setPage={page => updateSearch({ page })}
          rowsInTotal={logsTotal}
          rowsPerPage={params.size}
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
