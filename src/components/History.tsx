import React from 'react'
import Heading from './Heading'
import Typography from './Typography'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import Pagination from './Pagination'
import LocationLink from './LocationLink'
import ChangedFields from './ChangedFields'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'
import { Log } from '../typings'

interface HistoryProps {
  data?: Log[]
  loading: boolean
  error: boolean
  page: number
  setPage: (page: number) => void
  rowsInTotal?: number
  rowsPerPage: number
  onClose: () => void
}

const History = ({
  data,
  loading,
  error,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
  onClose,
}: HistoryProps) => {
  const { translations } = useLanguage()
  return (
    <Modal wide onClose={onClose}>
      <Heading level={4} gutterBottom>{translations.history}</Heading>
      <Typography gutterBottom>{translations.historyDescription}</Typography>
      {loading
        ? <Loader dark big />
        : error
          ? <Typography color='error'>{translations.connectionProblemLogs}</Typography>
          : <>
            <Table
              data={data?.map(item => ({
                timestamp: `${formatDate(item._source.timestamp)} ${formatTime(item._source.timestamp)}`,
                location: <>
                  <LocationLink name={item._source.name} id={item._source.doc_id} />
                  <ChangedFields item={item} />
                </>,
              })) || []}
              labels={[
                { name: 'Data', field: 'timestamp' },
                { name: 'Lokacja i edytowane pola', field: 'location' },
              ]}
            />
            {rowsInTotal && rowsInTotal > rowsPerPage &&
              <Pagination
                count={rowsInTotal}
                rowsPerPage={rowsPerPage}
                page={page}
                callback={newPage => setPage(newPage)}
              />
            }
          </>
      }
    </Modal>
  )
}

export default History
