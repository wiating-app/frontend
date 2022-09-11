import React from 'react'
import { useSnackbar } from 'notistack'
import api from '../api'
import Reports from '../components/Reports'
import ReportDetails from '../components/ReportDetails'
import useAuth0 from '../utils/useAuth0'
import serializeData from '../utils/serializeData'


const ReportsContainer = () => {
  const { user, isModerator } = useAuth0()
  const { enqueueSnackbar } = useSnackbar()
  const [reports, setReports] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [details, setDetails] = React.useState()
  const [markAsDoneLoading, setMarkAsDoneLoading] = React.useState()

  const getReports = async () => {
    try {
      setLoading(true)
      const { data: { points } } = await api.post('search_points', {
        report_reason: true,
      })
      setReports(points.map(item => serializeData(item)))
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }
  React.useEffect(() => { isModerator && getReports() }, [isModerator])

  const markAsDoneCallback = async () => {
    setMarkAsDoneLoading(true)
    try {
      await api.post(`report/${details.id}`, { report_reason: null })
      enqueueSnackbar('Zgłoszenie oznaczone jako załatwione.', { variant: 'success' })
      setReports(prevState => prevState.filter(item => item.id !== details.id))
      setMarkAsDoneLoading(false)
      setDetails(null)
    } catch (err) {
      console.error(err)
      setMarkAsDoneLoading(false)
      enqueueSnackbar('Nie udało się odznaczyć zgłoszenia.', { variant: 'error' })
    }
  }

  return (
    isModerator
      ? <>
        <Reports
          reports={reports}
          loading={loading}
          error={error}
          user={user}
          setDetails={data => setDetails(data)}
        />
        {details &&
          <ReportDetails
            data={details}
            markAsDoneCallback={markAsDoneCallback}
            loading={markAsDoneLoading}
            onClose={() => setDetails(null)}
          />
        }
      </>
      : null
  )
}

export default ReportsContainer
