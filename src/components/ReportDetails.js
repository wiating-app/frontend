import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { Check } from '@material-ui/icons'
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
        Szczegóły zgłoszenia do lokacji <OpenInNewCard path={`/location/${data.doc_id}`}>{data.name} ({data.id})</OpenInNewCard>
      </Typography>
      <Typography
        variant='body2'
        gutterBottom
      >Data ostatniej edycji punktu: {data.last_modified_timestamp}</Typography>

      <Table
        data={data.report_reason.map((item, index) => ({
          report_reason: <Typography key={index} variant='caption' gutterBottom>{item}</Typography>
        }))}
        labels={[
          { name: 'Treść zgłoszenia', field: 'report_reason' },
        ]}
      />
      <Button
        variant='contained'
        onClick={markAsDoneCallback}
        style={{ marginTop: 20 }}
        disabled={loading}
      >{loading ? <Loader dark /> : <Check />} Oznacz wszystkie zgłoszenia jako załatwione</Button>
    </Modal>
  )
}

export default ReportDetails
