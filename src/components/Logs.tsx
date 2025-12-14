import React from 'react'
import { Check, Minus } from 'lucide-react'
import { Log, User } from '../typings'
import { formatDate, formatTime } from '../utils/helpers'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import ButtonGroup from './ButtonGroup'
import ChangedFields from './ChangedFields'
import Loader from './Loader'
import LocationLink from './LocationLink'
import Pagination from './Pagination'
import Table from './Table'
import Typography from './Typography'

interface LogsProps {
  logs: Log[]
  user?: User
  loading: boolean
  error: boolean
  page: number
  setPage: (page: number) => void
  rowsInTotal?: number
  rowsPerPage: number
  setDetails: (data: Log) => void
}

const Logs = ({ logs, user, loading, error, page, setPage, rowsInTotal, rowsPerPage, setDetails }: LogsProps) => {
  const { translations } = useLanguage()
  const {
    settings: { enableVerification },
  } = useConfig()

  return loading ? (
    <Loader dark big centered />
  ) : error ? (
    <Typography color="error">{translations.connectionProblemLogs}</Typography>
  ) : (
    <>
      <Table
        data={logs.map(item => ({
          ...(enableVerification
            ? {
                verified: item._source.reviewed_at ? (
                  <Check size={20} style={{ color: '#008080' }} />
                ) : (
                  <Minus size={20} style={{ color: '#9e9e9e' }} />
                ),
              }
            : {}),
          timestamp: `${formatDate(item._source.timestamp)} ${formatTime(item._source.timestamp)}`,
          location: (
            <>
              <LocationLink name={item._source.name} id={item._source.doc_id} />
              <ChangedFields item={item} />
            </>
          ),
          user: (
            <div className="whitespace-nowrap">
              {item._source.modified_by === user?.sub ? user.name : item._source.modified_by}
            </div>
          ),
          actions: (
            <ButtonGroup>
              <Button variant="primary" onClick={() => setDetails(item)}>
                {translations.details}
              </Button>
            </ButtonGroup>
          ),
        }))}
        labels={[
          ...(enableVerification ? [{ name: translations.verification, field: 'verified' }] : []),
          { name: translations.date, field: 'timestamp' },
          { name: translations.locationAndFields, field: 'location', wide: true },
          { name: translations.authorOfChange, field: 'user' },
          { name: '', field: 'actions', wide: true },
        ]}
      />
      {rowsInTotal && rowsInTotal > rowsPerPage && (
        <Pagination count={rowsInTotal} rowsPerPage={rowsPerPage} page={page} callback={newPage => setPage(newPage)} />
      )}
    </>
  )
}

export default Logs
