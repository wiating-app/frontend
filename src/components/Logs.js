import React from 'react'
import { Typography, Box } from '@material-ui/core'
import Modal from './Modal'
import Table from './Table'
import Pagination from './Pagination'
import Actions from './Actions'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'


const Logs = ({
  logs,
  user,
  loadingLogs,
  errorLogs,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
  onClose,
  setDetails,
}) => {
  const { translations } = useLanguage()
  return (
    <Modal wide onClose={onClose}>
      <Typography
        variant='h4'
        gutterBottom
      >Administracja - historia zmian</Typography>
      {loadingLogs
        ? <Loader dark big />
        : errorLogs
          ? <Typography color='error'>{translations.connectionProblem.logs}</Typography>
          : <>
            <Table
              data={logs.map(item => ({
                timestamp: item._source.timestamp,
                location: <>
                  <OpenInNewCard path={`/location/${item._source.doc_id}`}>{item._source.name}</OpenInNewCard>
                  <Typography variant='caption' component='div'>
                    {Object.keys(item._source.changes).join(', ')}
                  </Typography>
                </>,
                user: <Box whiteSpace='nowrap'>{
                  item._source.modified_by === user.sub ? 'Ja' : item._source.modified_by}
                </Box>,
                actions: <Actions
                  primary={[
                    { label: 'Szczegóły', action: () => setDetails({ id: item._id, ...item._source }) },
                  ]}
                />,
              }))}
              labels={[
                { name: 'Data', field: 'timestamp' },
                { name: 'Lokacja i zmienione pola', field: 'location' },
                { name: 'Autor zmiany', field: 'user' },
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

export default Logs
