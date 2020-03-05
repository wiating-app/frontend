import React from 'react'
import { Button, Typography } from '@material-ui/core'
import Modal from './Modal'
import Table from './Table'

const LogDetails = ({ data }) => {
  return (
    <Modal short>
      <Typography variant='h5' gutterBottom>Szczegóły loga i345c435c</Typography>
      <Typography
        variant='body1'
        gutterBottom
      >
        ID autora: 734h4i7cfg{' '}
        <Button
          size='small'
          variant='outlined'
        >Zbanuj użytkownika</Button>
      </Typography>
      <Typography
        variant='body1'
        gutterBottom
      >Lokalizacja: 734h4i7cfg</Typography>
      <Typography variant='h6'>Zmiany</Typography>
      <Table
        data={[]}
        labels={[
          { name: 'Pole', field: 'name' },
          { name: 'Nowa treść', field: 'content' },
        ]}
      />
      <Button
        variant='contained'
        style={{ marginTop: 20 }}
      >Cofnij zmianę</Button>
    </Modal>
  )
}

export default LogDetails
