import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, Grid } from '@material-ui/core'
import { Check, List } from '@material-ui/icons'
import Modal from './Modal'
import Table from './Table'
import Loader from './Loader'
import OpenInNewCard from './OpenInNewCard'


const ReportDetails = ({
  data,
  markAsDoneCallback,
  loading,
  onClose,
}) => {
  return (
    <Modal short onClose={onClose}>
      <Typography variant='h5' gutterBottom>
        Zgłoszenia do lokacji<br />
        <strong>{data.name} ({data.id})</strong> <OpenInNewCard
          path={`/location/${data.id}`}
          component={Button}
          variant='contained'
          color='primary'
          size='small'
        >Pokaż</OpenInNewCard>
      </Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Data ostatniej edycji lokacji: {data.last_modified_timestamp}</Typography>

      <Table
        data={data.report_reason.map((item, index) => ({
          report_reason: <Typography key={index} variant='caption' gutterBottom>{item}</Typography>
        }))}
        labels={[
          { name: 'Treść zgłoszeń', field: 'report_reason' },
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
          ><List /> Pokaż logi lokacji</Button>
        </Grid>
        <Grid item>
          <Button
            variant='contained'
            onClick={markAsDoneCallback}
            style={{ marginTop: 20 }}
            disabled={loading}
          >{loading ? <Loader dark /> : <Check />} Oznacz zgłoszenia jako załatwione</Button>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default ReportDetails
