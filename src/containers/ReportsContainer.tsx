import React from 'react'
import { toast } from 'sonner'
import { getReports } from '../api/getReports'
import { markAsDone } from '../api/markAsDone'
import Reports from '../components/Reports'
import ReportDetails from '../components/ReportDetails'
import useAuth0 from '../utils/useAuth0'
import { Location } from '../typings'

const ReportsContainer = () => {
  const { isModerator } = useAuth0()
  const [reports, setReports] = React.useState<Location[]>()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const [details, setDetails] = React.useState<Location>()
  const [markAsDoneLoading, setMarkAsDoneLoading] = React.useState(false)

  const fetchReports = async () => {
    try {
      setLoading(true)
      const reports = await getReports()
      setReports(reports)
    } catch (err) {
      console.error(err)
      setError(true)
    }
    setLoading(false)
  }
  React.useEffect(() => { isModerator && fetchReports() }, [isModerator])

  const markAsDoneCallback = async () => {
    if (!details) return
    setMarkAsDoneLoading(true)
    try {
      await markAsDone(details.id)
      toast.success('Zgłoszenie oznaczone jako załatwione.')
      setReports(prevState => prevState?.filter(item => item.id !== details.id))
      setMarkAsDoneLoading(false)
      setDetails(undefined)
    } catch (err) {
      console.error(err)
      setMarkAsDoneLoading(false)
      toast.error('Nie udało się odznaczyć zgłoszenia.')
    }
  }

  return (
    isModerator
      ? <>
        <Reports
          reports={reports}
          loading={loading}
          error={error}
          setDetails={(data: Location) => setDetails(data)}
        />
        {details &&
          <ReportDetails
            data={details as Location & { report_reason: string[] }}
            markAsDoneCallback={markAsDoneCallback}
            loading={markAsDoneLoading}
            onClose={() => setDetails(undefined)}
          />
        }
      </>
      : null
  )
}

export default ReportsContainer
