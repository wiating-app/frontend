import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Grid } from '@material-ui/core'
import { Check, List } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'
import useLanguage from '../utils/useLanguage'
import { formatDate, formatTime } from '../utils/helpers'


const ReportDetails = ({
  data,
  markAsDoneCallback,
  loading,
  onClose,
}) => {
  const { translations } = useLanguage()
  return (
    <Modal short onClose={onClose}>
      <Typography variant='h5' gutterBottom>
        {translations.reportsForLocation}<br />
        <strong>{data.name} ({data.id})</strong> <OpenInNewCard
          path={`/location/${data.id}`}
          component={Button}
          variant='contained'
          color='primary'
          size='small'
        >{translations.show}</OpenInNewCard>
      </Typography>
      <Typography
        variant='body2'
        gutterBottom
      >{translations.dateOfLastEdit}: {`${formatDate(data.last_modified_timestamp)} ${formatTime(data.last_modified_timestamp)}`}</Typography>

      <Table
        data={data.report_reason.map((item, index) => ({
          report_reason: <Typography key={index} variant='caption' gutterBottom>{item}</Typography>
        }))}
        labels={[
          { name: translations.reportReason, field: 'report_reason' },
        ]}
      />
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        <Grid item>
          <Button
            component={Link}
            target='_blank'
            variant='contained'
            color='primary'
            to={`/moderator/log?id=${data.id}`}
            style={{ marginTop: 20 }}
          ><List /> {translations.showLocationLogs}</Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={markAsDoneCallback}
            style={{ marginTop: 20 }}
            disabled={loading}
          >{loading ? <Loader dark /> : <Check />} {translations.markAsDone}</Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ReportDetails
