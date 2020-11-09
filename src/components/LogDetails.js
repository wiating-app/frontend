import React from 'react'
import { Button, Typography, Grid, ButtonGroup } from '@material-ui/core'
import { Check, Clear, Remove } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'


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
  const { translations } = useLanguage()

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
      <Typography variant='h5' gutterBottom>{translations.detailsOfChange} {data.id}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >{translations.date}: {data.timestamp}</Typography>
      {isModerator &&
        <Typography
          variant='body2'
          gutterBottom
        >{translations.user}: {isMe ? translations.you : data.modified_by}</Typography>
      }
      <Typography
        variant='body2'
        gutterBottom
      >
        {translations.location}: <>
          <strong>{data.name} ({data.doc_id})</strong> <OpenInNewCard
            path={`/location/${data.doc_id}`}
            component={Button}
            variant='contained'
            color='primary'
            size='small'
          >{translations.show}</OpenInNewCard>
        </>
      </Typography>
      {isNew
        ? <Typography variant='h6'>{translations.newLocationCreated}</Typography>
        : <>
          <Typography variant='h6'>{translations.changes}</Typography>
          <Table
            data={changes}
            labels={[
              { name: translations.field, field: 'name' },
              { name: translations.oldContent, field: 'old' },
              { name: translations.newContent, field: 'new' },
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
            >{loadingReview ? <Loader dark /> : <Check />} {data.reviewed_at ? translations.alreadyVerified : translations.markAsVerified}</Button>
          </Grid>
          <Grid item>
            <ButtonGroup>
              <Button onClick={banCallback} disabled={isMe}>
                {loadingBan && <Loader dark />}
                {!isMe ? translations.banAuthor : translations.cannotBanYourself}
              </Button>
              <Button onClick={revertCallback}>{loadingRevert && <Loader dark />}{translations.revertThisChange}</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      }
    </Modal>
  )
}

export default LogDetails
