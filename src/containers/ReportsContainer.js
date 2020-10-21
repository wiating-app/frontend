import React from 'react'
import api from '../api'
import Reports from '../components/Reports'
import useAuth0 from '../utils/useAuth0'
import history from '../history'


const ReportsContainer = ({ setCachedLogDetails }) => {
  const { user, isModerator } = useAuth0()
  const [reports, setReports] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  const getReports = async () => {
    try {
      setLoading(true)
      const { data: { points } } = await api.post('search_points', {
        report_reason: true,
      })
      setReports(points)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }
  React.useEffect(() => { isModerator && getReports() }, [isModerator])

  return (
    isModerator
      ? <Reports
        reports={reports}
        loading={loading}
        error={error}
        user={user}
        setDetails={data => {
          setCachedLogDetails(data)
          history.push(`/moderator/log/${data.id}`)
        }}
      />
      : null
  )
}

export default ReportsContainer
