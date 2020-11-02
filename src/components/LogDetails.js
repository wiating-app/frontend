import React from 'react'
import { Button, Typography, Grid, ButtonGroup } from '@material-ui/core'
import { Check, Clear, Remove } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'


const LogDetails = ({
  data,
  isMe,
  isModerator,
  reviewCallback,
  banCallback,
  revertCallback,
  loadingReview,
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

  const isNew = data.changes.action && data.changes.action === 'created'

  return (
    <Modal short onClose={onClose}>
      <Typography variant='h5' gutterBottom>Szczegóły zmiany {data.id}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Data: {data.timestamp}</Typography>
      {isModerator &&
        <Typography
          variant='body2'
          gutterBottom
        >Użytkownik: {isMe ? 'Ja' : data.modified_by}</Typography>
      }
      <Typography
        variant='body2'
        gutterBottom
      >
        Lokacja: <>
          <strong>{data.name} ({data.doc_id})</strong> <OpenInNewCard
            path={`/location/${data.doc_id}`}
            component={Button}
            variant='contained'
            color='primary'
            size='small'
          >Pokaż</OpenInNewCard>
        </>
      </Typography>
      {isNew
        ? <Typography variant='h6'>Utworzenie nowej lokacji</Typography>
        : <>
          <Typography variant='h6'>Zmiany</Typography>
          <Table
            data={changes}
            labels={[
              { name: 'Pole', field: 'name' },
              { name: 'Stara treść', field: 'old' },
              { name: 'Nowa treść', field: 'new' },
            ]}
          />
        </>
      }
      {isModerator &&
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              onClick={reviewCallback}
              disabled={data.reviewed_at}
            >{loadingReview ? <Loader dark /> : <Check />} {data.reviewed_at ? 'Już zweryfikowano' : 'Oznacz jako zweryfikowany'}</Button>
          </Grid>
          <Grid item>
            <ButtonGroup>
              <Button onClick={banCallback} disabled={isMe}>
                {loadingBan && <Loader dark />}
                {!isMe ? 'Zbanuj autora' : 'Nie możesz zbanować sam(a) siebie'}
              </Button>
              <Button onClick={revertCallback}>{loadingRevert && <Loader dark />}Przywróć poprzednią wersję</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      }
    </Modal>
  )
}

export default LogDetails
