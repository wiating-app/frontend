import React from 'react'
import { diffWordsWithSpace } from 'diff'
import Button from './Button'
import Heading from './Heading'
import Typography from './Typography'
import ButtonGroup from './ButtonGroup'
import { Check, Clear, Remove } from '@material-ui/icons'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'
import { LogSource } from '../typings'


interface LogDetailsProps {
  data: LogSource
  isMe: boolean
  isModerator: boolean
  reviewCallback: () => void | Promise<void>
  banCallback: () => void | Promise<void>
  revertCallback: () => void | Promise<void>
  loadingReview: boolean
  loadingBan: boolean
  loadingRevert: boolean
}

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
}: LogDetailsProps) => {
  const { translations } = useLanguage()


  const readValue = (name: string, value: any): React.ReactNode => value
    ? value === true
      ? <Check style={{ color: '#008080' }} />
      : name === 'images'
        ? <img
          src={`${process.env.FRONTEND_CDN_URL}/${data.doc_id}/${value.replace('.jpg', '_m.jpg')}`}
          width={100}
          alt=''
        />
        : value
    : value === false ? <Clear color='error' /> : <Remove color='disabled' />


  const renderDiff = (one: string, other: string): React.ReactNode => {
    const diff = diffWordsWithSpace(one, other)

    return <>{diff.map(({ added, removed, value }, index) => {
      const isChange = (added || removed)
      return <span key={index} style={{
        backgroundColor: added ? '#acf2bd' : removed ? '#ffdcdf' : 'transparent',
        paddingLeft: isChange ? 2 : 0,
        paddingRight: isChange ? 2 : 0,
        marginLeft: isChange ? 2 : 0,
        marginRight: isChange ? 2 : 0,
        borderRadius: isChange ? 2 : 0,
        textDecoration: removed ? 'line-through rgba(255,0,0,.5)' : 'none',
      }}>{value}</span>
    })}</>
  }


  const changes = data.changes
    ? Object.entries(data.changes)
      .filter(([name]) => name !== 'action')
      .map(([name, values]: [string, any]) => ({
        name,
        old: readValue(name, values.old_value),
        new: readValue(name, name === 'description' || name === 'directions'
          ? renderDiff(String(values.old_value || ''), String(values.new_value || ''))
          : values.new_value
        ),
      }))
    : []


  const isNew = data.changes?.action && data.changes.action === 'created'


  return (
    <>
      <Heading level={5} gutterBottom>{translations.detailsOfChange} {data.id}</Heading>
      <Typography variant='body2' gutterBottom>
        {translations.date}: {formatDate(data.timestamp, 'verbal')}, {formatTime(data.timestamp, 'detailed')}
      </Typography>
      {isModerator &&
        <Typography variant='body2' gutterBottom>
          {translations.user}: {isMe ? translations.you : data.modified_by}
        </Typography>
      }
      <Typography variant='body2' gutterBottom>
        {translations.location}: <>
          <strong>{data.name} ({data.doc_id})</strong> <OpenInNewCard
            path={`/location/${data.doc_id}`}
            component={Button as any}
            variant='primary'
            size='small'
          >{translations.show}</OpenInNewCard>
        </>
      </Typography>
      {isNew
        ? <Heading level={6}>{translations.newLocationCreated}</Heading>
        : <>
          <Heading level={6}>{translations.changes}</Heading>
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
        <div className="flex gap-4 mt-5">
          <div>
            <Button
              variant='primary'
              onClick={reviewCallback}
              disabled={!!data.reviewed_at}
            >{loadingReview ? <Loader dark /> : <Check />} {data.reviewed_at ? translations.alreadyVerified : translations.markAsVerified}</Button>
          </div>
          <div>
            <ButtonGroup>
              <Button onClick={banCallback} disabled={isMe}>
                {loadingBan && <Loader dark />}
                {!isMe ? translations.banAuthor : translations.cannotBanYourself}
              </Button>
              <Button onClick={revertCallback}>{loadingRevert && <Loader dark />}{translations.revertThisChange}</Button>
            </ButtonGroup>
          </div>
        </div>
      }
    </>
  )
}

export default LogDetails
