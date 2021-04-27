import React from 'react'
import { diffSentences } from 'diff'
import { Button, Typography, Grid, ButtonGroup } from '@material-ui/core'
import { Check, Clear, Remove } from '@material-ui/icons'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'


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
}) => {
  const { translations } = useLanguage()


  const readValue = (name, value) => value
    ? value === true
      ? <Check style={{ color: '#008080' }} />
      : name === 'images'
        ? <img
          src={`${process.env.FRONTEND_CDN_URL}/${data.doc_id}/${value.replace('.jpg', '_m.jpg')}`}
          width={100}
        />
        : value
    : value === false ? <Clear color='error' /> : <Remove color='disabled' />


  const renderDiff = (one, other) => {
    const diff = diffSentences(one, other)

    return <>{diff.map(({ added, removed, value }, index) => {
      const isChange = (added || removed)
      return <span key={index} style={{
        backgroundColor: added ? '#acf2bd' : removed ? '#ffdcdf' : 'transparent',
        paddingLeft: isChange ? 2 : 0,
        paddingRight: isChange ? 2 : 0,
        marginLeft: isChange ? 2 : 0,
        marginRight: isChange ? 2 : 0,
        borderRadius: isChange ? 2 : 0,
      }}>{value}</span>
    })}</>
  }


  const changes = data.changes
    ? Object.entries(data.changes)
      .filter(([name, values]) => name !== 'action')
      .map(([name, values]) => ({
        name,
        old: readValue(name, values.old_value),
        new: readValue(name, name === 'description' || name === 'directions'
          ? renderDiff(values.old_value, values.new_value)
          : values.new_value
        ),
      }))
    : []


  const isNew = data.changes.action && data.changes.action === 'created'


  return (
    <>
      <Typography variant='h5' gutterBottom>{translations.detailsOfChange} {data.id}</Typography>
      <Typography
        variant='body2'
        gutterBottom
      >{translations.date}: {formatDate(data.timestamp, 'verbal')}, {formatTime(data.timestamp, 'detailed')}</Typography>
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
    </>
  )
}

export default LogDetails
