import React from 'react'
import { Button } from '@material-ui/core'
import Overlay from './Overlay'
import Table from './Table'
import Pagination from './Pagination'

const Logs = ({
  data,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
}) =>
  <Overlay>
    <h2>Logi (historia zmian)</h2>
    <Table
      data={data.map(item => ({
        ...item,
        location: <>{item.location.name}<br />({item.location._id})</>,
        actions: <>
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={() => alert('W przyszłości ten przycisk będzie wyświetlał szczegóły danego loga.')}
          >Zobacz</Button>
          {' '}
          <Button
            size='small'
            color='secondary'
            onClick={() => confirm('Czy na pewno chcesz zbanować użytkownika, który był autorem tego loga?')}
          >Banuj</Button>
        </>,
      }))}
      labels={[
        { name: 'ID', field: '_id' },
        { name: 'Data', field: 'timestamp' },
        { name: 'Lokacja', field: 'location' },
        { name: 'Użytkownik', field: 'user' },
        { name: 'Akcje', field: 'actions' },
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
  </Overlay>

export default Logs
