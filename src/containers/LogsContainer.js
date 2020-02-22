import React from 'react'
import Logs from '../components/Logs'


const LogsContainer = () => {
  const [page, setPage] = React.useState(0) // Page numeration starts at 0.
  const data = [
    {
      _id: '56gdh7gl09',
      timestamp: '12345678',
      user: '093q84cp',
      location: { _id: '34trhg', name: 'Chatka na końcu świata' },
    },
    {
      _id: 'o9vo5u8345',
      timestamp: '12345678',
      user: 'cn873th2',
      location: { _id: '34vtr', name: 'Chatka na końcu świata' },
    },
    {
      _id: '3q4u5zl201',
      timestamp: '12345678',
      user: 'd4whj875',
      location: { _id: 'serv4', name: 'Chatka na końcu świata' },
    },
  ]
  const rowsInTotal = 20
  return (
    <Logs
      data={data}
      page={page}
      setPage={setPage}
      rowsInTotal={rowsInTotal}
      rowsPerPage={3}
    />
  )
}

export default LogsContainer
