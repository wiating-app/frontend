import React from 'react'
import { Typography } from '@material-ui/core'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
// import Actions from './Actions'
import Pagination from './Pagination'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'

const History = ({
  data,
  loading,
  error,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
  setDetails,
  onClose,
}) => {
  const { translations } = useLanguage()
  return (
    <Modal wide onClose={onClose}>
      <Typography
        variant='h4'
        gutterBottom
      >{translations.history}</Typography>
      <Typography
        gutterBottom
      >{translations.historyDescription}</Typography>
      {loading
        ? <Loader dark big />
        : error
          ? <Typography color='error'>{translations.connectionProblem.logs}</Typography>
          : <>
            <Table
              data={data.map(item => ({
                timestamp: `${formatDate(item._source.timestamp)} ${formatTime(item._source.timestamp)}`,
                location: <>
                  <OpenInNewCard path={`/location/${item._source.doc_id}`}>{item._source.name}</OpenInNewCard>
                  <Typography variant='caption' component='div'>
                    {item._source.changes.action && item._source.changes.action === 'created'
                      ? 'Nowa lokacja'
                      : Object.keys(item._source.changes).join(', ')
                    }
                  </Typography>
                </>,
                // actions: <Actions
                //   primary={[
                //     { label: 'Szczegóły', action: () => setDetails({ id: item._id, ...item._source }) },
                //   ]}
                // />,
              }))}
              labels={[
                { name: 'Data', field: 'timestamp' },
                { name: 'Lokacja i edytowane pola', field: 'location' },
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
    </Modal>
  )
}

export default History
