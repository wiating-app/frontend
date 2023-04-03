import React from 'react'
import { Typography } from '@material-ui/core'
import Table from './Table'
import Actions from './Actions'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'


const Reports = ({
  reports,
  loading,
  error,
  setDetails,
}) => {
  const { translations } = useLanguage()
  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblemLogs}</Typography>
      : reports.length
        ? <Table
          data={reports.map(item => ({
            timestamp: `${formatDate(item.last_modified_timestamp)} ${formatTime(item.last_modified_timestamp)}`,
            location: <OpenInNewCard path={`/location/${item.id}`}>{item.name}</OpenInNewCard>,
            report_reason: item.report_reason.map((item, index) =>
              <Typography key={index} variant='caption'>{item}</Typography>
            ),
            actions: <Actions
              primary={[
                {
                  label: translations.details,
                  action: () => setDetails(item),
                },
              ]}
            />,
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
