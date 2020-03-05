import React from 'react'
import { Typography } from '@material-ui/core'
import Modal from './Modal'
import Text from './Text'
import Table from './Table'
import Pagination from './Pagination'
import Actions from './Actions'
import Loader from './Loader'
import LogDetails from './LogDetails'


const Logs = ({
  data,
  loading,
  error,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
}) => {
  const [details, setDetails] = React.useState()
  return (
    <>
      <Modal wide>
        <Typography
          variant='h4'
          gutterBottom
        >Administracja - historia zmian</Typography>
        {loading
          ? <Loader loading={loading} error={error} dark big />
          : error
            ? <Typography color='error'><Text id='connectionProblem.logs' /></Typography>
            : <>
              <Table
                data={data.map(item => ({
                  id: item._id,
                  timestamp: item._source.timestamp,
                  location: <>{item._source.name}<br />({item._source.doc_id})</>,
                  user: item._source.modified_by,
                  actions: <Actions
                    primary={[
                      { label: 'Szczegóły', action: () => setDetails({ id: item._id, ...item._source }) },
                    ]}
                  />,
                }))}
                labels={[
                  { name: 'ID', field: 'id' },
                  { name: 'Data', field: 'timestamp' },
                  { name: 'Lokacja', field: 'location' },
                  { name: 'Identyfikator użytkownika', field: 'user' },
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
      {details &&
        <LogDetails
          data={details}
          banCallback={() => {}}
          revertCallback={() => {}}
        />
      }
    </>
  )
}

export default Logs
