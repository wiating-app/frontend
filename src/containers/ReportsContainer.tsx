import React from 'react'
import { toast } from 'sonner'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReports } from '../api/getReports'
import { markAsDone } from '../api/markAsDone'
import Reports from '../components/Reports'
import ReportDetails from '../components/ReportDetails'
import useAuth0 from '../utils/useAuth0'
import { Location } from '../typings'

const ReportsContainer = () => {
  const { isModerator } = useAuth0()
  const queryClient = useQueryClient()
  const [details, setDetails] = React.useState<Location>()

  const { data: reports, isLoading: loading, isError: error } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
    enabled: isModerator,
  })

  const markAsDoneMutation = useMutation({
    mutationFn: markAsDone,
    onSuccess: () => {
      toast.success('Zgłoszenie oznaczone jako załatwione.')
      queryClient.setQueryData<Location[]>(['reports'], (old) =>
        old?.filter(item => item.id !== details?.id)
      )
      setDetails(undefined)
    },
    onError: () => {
      toast.error('Nie udało się odznaczyć zgłoszenia.')
    },
  })

  const markAsDoneCallback = async () => {
    if (!details) return
    markAsDoneMutation.mutate(details.id)
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
            loading={markAsDoneMutation.isLoading}
            onClose={() => setDetails(undefined)}
          />
        }
      </>
      : null
  )
}

export default ReportsContainer
