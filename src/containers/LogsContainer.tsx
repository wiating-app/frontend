import { parse, stringify } from 'querystringify'

import LogFilters from '../components/LogFilters'
import Logs from '../components/Logs'
import React from 'react'
import { getLogs, LogParams } from '../api/getLogs'
import useAuth0 from '../utils/useAuth0'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useHistory, useLocation } from 'react-router-dom'
import { LogDetails } from '../typings'

/* eslint-disable camelcase */

const LogsContainer: React.FC = () => {
  const history = useHistory()
  const { search, pathname } = useLocation()
  const { isModerator, user } = useAuth0()
  const queryClient = useQueryClient()

  const [params, setParams] = React.useState<LogParams>({
    ...parse(search) as any,
    page: 0, // Page numeration starts at 0.
    size: 10, // Rows per page.
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['logs', 'list', params],
    queryFn: () => getLogs(params),
    enabled: isModerator,
  })

  const logs = data?.logs || []
  const logsTotal = data?.total

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
    // Remove refetchLogs param if present (legacy param, query invalidation handles refetching now)
    if (refetchLogs) {
      history.replace({
        pathname,
        search: search.replace(/[&?]refetchLogs=true/, ''),
      })
    }
    setParams(prevState => ({
      page: page !== undefined ? parseInt(page) : prevState.page,
      size: parseInt(size) || prevState.size,
      ...id && { id },
      ...reviewed_at && { reviewed_at: JSON.parse(reviewed_at) },
    }))
  }, [search, pathname, history])

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
          loading={isLoading}
          error={isError}
          page={params.page}
          setPage={(page: number) => updateSearch({ page })}
          rowsInTotal={logsTotal}
          rowsPerPage={params.size}
          user={user || undefined}
          setDetails={async (data: LogDetails) => {
            queryClient.setQueryData(['logs', 'detail', data._id], data)
            history.push(`/moderator/log/${data._id}${search || ''}`)
          }}
        />
      </>
      : null
  )
}

export default LogsContainer
