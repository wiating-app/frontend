import React from 'react'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import History from '../components/History'
import history from '../history'


const HistoryContainer = ({ setCachedLogDetails }) => {
  const { loading: loadingAuth } = useAuth0()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [data, setData] = React.useState()
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const [logsTotal, setlogsTotal] = React.useState()
  const rowsPerPage = 10

  const getHistory = async () => {
    setLoading(true)
    try {
      const { data: { logs, total } } = await api.post('get_user_logs', {
        size: rowsPerPage,
        offset: rowsPerPage * page,
      })
      setData(logs)
      setlogsTotal(total)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(true)
      setLoading(false)
    }
  }

  React.useEffect(() => { !loadingAuth && getHistory() }, [loadingAuth, page])

  return (
    <History
      data={data}
      loading={loadingAuth || loading}
      error={error}
      page={page}
      setPage={setPage}
      rowsInTotal={logsTotal}
      rowsPerPage={rowsPerPage}
      setDetails={data => {
        setCachedLogDetails(data)
        history.push(`/history/${data.id}`)
      }}
      onClose={() => history.push('/')}
    />
  )
}

export default HistoryContainer
