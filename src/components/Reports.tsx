import React from 'react'
import Typography from './Typography'
import Table from './Table'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'
import { Location } from '../typings'


interface ReportsProps {
  reports?: Location[]
  loading: boolean
  error: boolean
  setDetails: (data: Location) => void
}

const Reports = ({
  reports,
  loading,
  error,
  setDetails,
}: ReportsProps) => {
  const { translations } = useLanguage()
  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblemLogs}</Typography>
      : reports && reports.length
        ? <Table
          data={reports.map(item => ({
            timestamp: `${formatDate(item.last_modified_timestamp)} ${formatTime(item.last_modified_timestamp)}`,
            location: <OpenInNewCard path={`/location/${item.id}`}>{item.name}</OpenInNewCard>,
            report_reason: Array.isArray(item.report_reason)
              ? item.report_reason.map((item: string, index: number) =>
                <Typography key={index} variant='caption'>{item}</Typography>
              )
              : <Typography variant='caption'>{item.report_reason || ''}</Typography>,
            actions: <ButtonGroup>
              <Button variant='primary' size='small' onClick={() => setDetails(item)}>
                {translations.details}
              </Button>
            </ButtonGroup>,
          }))}
          labels={[
            { name: translations.date, field: 'timestamp' },
            { name: translations.location, field: 'location', wide: true },
            { name: translations.reportReason, field: 'report_reason', wide: true },
            { name: '', field: 'actions', wide: true },
          ]}
        />
        : <Typography>{translations.noReportsAvailable}</Typography>
}

export default Reports
