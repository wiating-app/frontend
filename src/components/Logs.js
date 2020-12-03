import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Check, Remove } from '@material-ui/icons'
import Table from './Table'
import Pagination from './Pagination'
import Actions from './Actions'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'


const Logs = ({
  logs,
  user,
  loading,
  error,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
  setDetails,
}) => {
  const { translations } = useLanguage()
  return loading
    ? <Loader dark big />
    : error
      ? <Typography color='error'>{translations.connectionProblem.logs}</Typography>
      : <>
        <Typography variant='h6'>{translations.itemsFound.replace('#', rowsInTotal)}:</Typography>
        <Table
          data={logs.map(item => ({
            verified: item._source.reviewed_at ? <Check style={{ color: '#008080' }} /> : <Remove color='disabled' />,
            timestamp: `${formatDate(item._source.timestamp)} ${formatTime(item._source.timestamp)}`,
            location: <>
              <OpenInNewCard path={`/location/${item._source.doc_id}`}>{item._source.name}</OpenInNewCard>
              <Typography variant='caption' component='div'>
                {item._source.changes.action && item._source.changes.action === 'created'
                  ? translations.newLocation
                  : Object.keys(item._source.changes).join(', ')
                }
              </Typography>
            </>,
            user: <Box whiteSpace='nowrap'>{
              item._source.modified_by === user.sub ? translations.you : item._source.modified_by}
            </Box>,
            actions: <Actions
              primary={[
                {
                  label: translations.details,
                  action: () => setDetails({ id: item._id, ...item._source }),
                },
              ]}
            />,
          }))}
          labels={[
            { name: translations.verified, field: 'verified' },
            { name: translations.date, field: 'timestamp' },
            { name: translations.locationAndFields, field: 'location' },
            { name: translations.authorOfChange, field: 'user' },
            { name: '', field: 'actions' },
          ]}
        />
        {rowsInTotal > rowsPerPage &&
          <Pagination
            count={rowsInTotal}
            rowsPerPage={rowsPerPage}
            page={page}
            callback={newPage => setPage(newPage)}
          />
        }
      </>
}

export default Logs
