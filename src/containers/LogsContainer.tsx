import { logDetailsState, logsState } from '../state'
import { parse, stringify } from 'querystringify'

import LogFilters from '../components/LogFilters'
import Logs from '../components/Logs'
import React from 'react'
import { getLogs, LogParams } from '../api/getLogs'
import useAuth0 from '../utils/useAuth0'
import { useRecoilState } from 'recoil'
import { useHistory, useLocation } from 'react-router-dom'
import { Log, LogDetails } from '../typings'

/* eslint-disable camelcase */

const LogsContainer: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const { search, pathname } = location
  const { isModerator, user } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [logsTotal, setlogsTotal] = React.useState<number>()
  const [params, setParams] = React.useState<LogParams>({
    ...parse(search) as any,
    page: 0, // Page numeration starts at 0.
    size: 10, // Rows per page.
  })
  const [logs, setLogs] = useRecoilState(logsState)
  const [, setLogDetails] = useRecoilState(logDetailsState)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const { logs, total } = await getLogs(params)
      setLogs(logs)
      setlogsTotal(total)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }

  React.useEffect(() => {
    isModerator && fetchLogs()
  }, [isModerator, params])

  const updateSearch = (newParams: Partial<LogParams>) => {
    const newFiltersQueryString = stringify({
      ...params,
      ...newParams,
    }, true)
    history.replace(`/moderator/log${newFiltersQueryString}`)
  }

  // Parse search.
  React.useEffect(() => {
    const { page, size, id, reviewed_at, refetchLogs } = parse(search) as any
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

  const handleFitlersSubmit = (fields: Partial<LogParams>) => {
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
          setPage={(page: number) => updateSearch({ page })}
          rowsInTotal={logsTotal}
          rowsPerPage={params.size}
          user={user || undefined}
          setDetails={async (data: LogDetails) => {
            await setLogDetails(data)
            history.push(`/moderator/log/${data._id}${search || ''}`)
          }}
        />
      </>
      : null
  )
}

export default LogsContainer
