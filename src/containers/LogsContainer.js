import { logDetailsState, logsState } from '../state'
import { parse, stringify } from 'querystringify'

import LogFilters from '../components/LogFilters'
import Logs from '../components/Logs'
import React from 'react'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import { useRecoilState } from 'recoil'
import { withRouter } from 'react-router-dom'

/* eslint-disable camelcase */

const LogsContainer = ({
  location: { search, pathname },
  history,
}) => {
  const { isModerator, user } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [logsTotal, setlogsTotal] = React.useState()
  const [params, setParams] = React.useState({
    ...parse(search),
    page: 0, // Page numeration starts at 0.
    size: 10, // Rows per page.
  })
  const [logs, setLogs] = useRecoilState(logsState)
  const [, setLogDetails] = useRecoilState(logDetailsState)

  const getLogs = async () => {
    try {
      setLoading(true)
      const { page, size, id, reviewed_at } = params
      const { data: { logs, total } } = await api.get(`get_logs${id ? `/${id}` : ''}`, {
        params: {
          size,
          offset: size * page,
          reviewed_at,
        },
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
          page: page !== undefined ? parseInt(page) : prevState.page,
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
          setDetails={async data => {
            await setLogDetails(data)
            history.push(`/moderator/log/${data._id}${search || ''}`)
          }}
        />
      </>
      : null
  )
}

export default withRouter(LogsContainer)
