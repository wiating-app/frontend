import React from 'react'
import { diffWordsWithSpace } from 'diff'
import Button from './Button'
import Heading from './Heading'
import Typography from './Typography'
import { Check, X, ShieldCheck } from 'lucide-react'
import Table from './Table'
import Loader from './Loader'
import LocationLink from './LocationLink'
import Chip from './Chip'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'
import { LogSource, User } from '../typings'
import FormActions from './Inputs/FormActions'


interface LogDetailsProps {
  data: LogSource
  isMe: boolean
  isModerator: boolean
  user: User
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
  user,
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
      ? <Check size={20} className="text-gray-600" />
      : name === 'images'
        ? <img
          src={`${process.env.FRONTEND_CDN_URL}/${data.doc_id}/${value.replace('.jpg', '_m.jpg')}`}
          alt=''
          className="rounded w-24"
        />
        : value
    : value === false ? <X size={20} className="text-gray-600" /> : <div className="text-gray-400">-</div>


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
        name: <Chip size="small" label={name} />,
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
      <Heading level={5} gutterBottom>
        {translations.detailsOfChange} {formatDate(data.timestamp, 'verbal')}, {formatTime(data.timestamp, 'detailed')}
      </Heading>
      <Typography variant='body2'>
        {translations.location}: <LocationLink name={data.name} id={data.doc_id} />
      </Typography>
      {isModerator &&
        <Typography variant='body2' gutterBottom>
          {translations.authorOfChange}: {isMe ? user.name : data.modified_by}
        </Typography>
      }
      {isNew
        ? <Typography variant="subtitle1">{translations.newLocationCreated}.</Typography>
        : <>
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
        <FormActions>
          {!isMe &&
            <Button onClick={banCallback}>
              {loadingBan && <Loader dark />}
              {translations.banAuthor}
            </Button>
          }
          <Button onClick={revertCallback}>{loadingRevert && <Loader dark />}{translations.revertThisChange}</Button>
          <Button
            variant='success'
            onClick={reviewCallback}
            disabled={!!data.reviewed_at}
          >{loadingReview ? <Loader dark /> : <ShieldCheck size={20} strokeWidth={2.5} />} {data.reviewed_at ? translations.alreadyVerified : translations.markAsVerified}</Button>
        </FormActions>
      }
    </>
  )
}

export default LogDetails
