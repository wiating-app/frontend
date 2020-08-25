import React from 'react'
import { Button, Typography, Grid } from '@material-ui/core'
import { Check, Clear, Remove } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'


const LogDetails = ({
  data,
  banCallback,
  revertCallback,
  loadingBan,
  loadingRevert,
  onClose,
}) => {
  const readValue = (name, value) => value
    ? value === true
      ? <Check style={{ color: '#008080' }} />
      : name === 'images'
        ? <img
          src={`${process.env.REACT_APP_CDN_URL}/${data.doc_id}/${value.replace('.jpg', '_m.jpg')}`}
          width={100}
        />
        : value
    : value === false ? <Clear color='error' /> : <Remove color='disabled' />

  const changes = data.changes
    ? Object.entries(data.changes)
      .filter(([name, values]) => name !== 'action')
      .map(([name, values]) => ({
        name,
        old: readValue(name, values.old_value),
        new: readValue(name, values.new_value),
      }))
    : []

  return (
    <Modal short onClose={onClose}>
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
        data={changes}
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
            onClick={() => revertCallback(data.doc_id, data.changes)}
          >{loadingRevert && <Loader dark />}Przywróć poprzednią wersję</Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default LogDetails
