import React from 'react'
import Button from './Button'
import Heading from './Heading'
import Typography from './Typography'
import { Check, List } from 'lucide-react'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'
import { Location } from '../typings'


interface ReportDetailsProps {
  data: Location & {
    report_reason: string[]
  }
  markAsDoneCallback: () => void | Promise<void>
  loading: boolean
  onClose: () => void
}

const ReportDetails = ({
  data,
  markAsDoneCallback,
  loading,
  onClose,
}: ReportDetailsProps) => {
  const { translations } = useLanguage()
  return (
    <Modal short onClose={onClose}>
      <Heading level={5} gutterBottom>
        {translations.reportsForLocation}<br />
        <strong>{data.name} ({data.id})</strong> <OpenInNewCard
          path={`/location/${data.id}`}
          component={Button as any}
          variant='primary'
          size='small'
        >{translations.show}</OpenInNewCard>
      </Heading>
      <Typography variant='body2' gutterBottom>
        {translations.dateOfLastEdit}: {`${formatDate(data.last_modified_timestamp)} ${formatTime(data.last_modified_timestamp)}`}
      </Typography>

      <Table
        data={data.report_reason.map((item, index) => ({
          report_reason: <Typography key={index} variant='caption' gutterBottom>{item}</Typography>,
        }))}
        labels={[
          { name: translations.reportReason, field: 'report_reason' },
        ]}
      />
      <div className="flex gap-4 mt-5">
        <div>
          <Button
            to={`/moderator/log?id=${data.id}`}
            target='_blank'
            variant='primary'
            className="mt-5"
          ><List size={20} /> {translations.showLocationLogs}</Button>
        </div>
        <div>
          <Button
            variant='default'
            onClick={markAsDoneCallback}
            className="mt-5"
            disabled={loading}
          >{loading ? <Loader dark /> : <Check size={20} />} {translations.markAsDone}</Button>
        </div>
      </div>
    </Modal>
  )
}

export default ReportDetails
