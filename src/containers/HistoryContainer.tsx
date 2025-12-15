import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserLogs } from '../api/getUserLogs'
import History from '../components/History'
import history from '../history'

const HistoryContainer = () => {
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const rowsPerPage = 10

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userLogs', page],
    queryFn: () =>
      getUserLogs({
        size: rowsPerPage,
        offset: rowsPerPage * page,
      }),
  })

  return (
    <History
      data={data?.logs}
      loading={isLoading}
      error={isError}
      page={page}
      setPage={setPage}
      rowsInTotal={data?.total}
      rowsPerPage={rowsPerPage}
      onClose={() => history.push('/')}
    />
  )
}

export default HistoryContainer
