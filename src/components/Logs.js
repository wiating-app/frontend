import React from 'react'
import Overlay from './Overlay'
import Table from './Table'
import Pagination from './Pagination'
import Actions from './Actions'


const Logs = ({
  data,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
}) =>
  <Overlay wide>
    <h2>Logi (historia zmian)</h2>
    <Table
      data={data.map(item => ({
        ...item,
        location: <>{item.location.name}<br />({item.location._id})</>,
        actions: <Actions
          primary={[
            { label: 'Pokaż', action: () => alert('Wyświetlenie szczegółów danego loga.') },
          ]}
          secondary={[
            { label: 'Cofnij akcję', action: () => alert('Cofnięcie akcji, która poskutkowała danym logiem.') },
            { label: 'Zbanuj użytkownika', action: () => alert('Zablokowanie konta autora danego loga.') },
          ]}
        />,
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
