import React from 'react'
import { Button, Typography, Grid } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'


const LogDetails = ({
  data,
  banCallback,
  revertCallback,
  loadingBan,
  loadingRevert,
}) => {
  const changed = data.changed
    ? Object.entries(data.changed).map(([name, values]) => ({
      name,
      old: values.old_value || <Clear color='disabled' />,
      new: values.new_value || <Clear color='disabled' />,
    }))
    : []
  const added = data.added
    ? Object.entries(data.added).map(([name, value]) => ({
      name,
      old: <Clear color='disabled' />,
      new: value || <Clear color='disabled' />,
    }))
    : []
  const modifications = [...changed, ...added]

  return (
    <Modal short>
      <Typography variant='h5' gutterBottom>Szczegóły loga {data.id}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Data: {data.timestamp}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Identyfikator użytkownika: {data.modified_by}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Lokalizacja: {data.name} ({data.doc_id})</Typography>
      <Typography variant='h6'>Zmiany</Typography>
      <Table
        data={modifications}
        labels={[
          { name: 'Pole', field: 'name' },
          { name: 'Stara treść', field: 'old' },
          { name: 'Nowa treść', field: 'new' },
        ]}
      />
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item>
          <Button
            variant='contained'
            onClick={() => banCallback(data.modified_by)}
            disabled={!banCallback}
          >
            {loadingBan && <Loader dark />}
            {banCallback ? 'Zbanuj autora' : 'Nie możesz zbanować sam(a) siebie'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={() => revertCallback(data.id, data.changed, data.added)}
          >{loadingRevert && <Loader dark />}Przywróć poprzednią wersję</Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default LogDetails
