import React from 'react'
import { Typography } from '@material-ui/core'
import Form from 'react-standalone-form'
import { Input, FormButton } from 'react-standalone-form-mui'
import Modal from './Modal'
import Select from './Select'
import useLanguage from '../utils/useLanguage'


const Report = ({ handleReport, onClose }) => {
  const [loading, setLoading] = React.useState(false)
  const [selectedReason, setSelectedReason] = React.useState()
  const { translations } = useLanguage()

  const reasons = ['duplicate', 'doesNotExist', 'photoRemoval', 'other']

  return (
    <Modal short onClose={onClose}>
      <Typography
        variant='h4'
        gutterBottom
      >Zgłoś nieprawidłowość</Typography>
      <Typography gutterBottom>Znalazłeś/aś nieprawidłowość w punkcie? </Typography>
      <Form
        fields={['reason', 'description']}
        allRequired
        onChange={fields => setSelectedReason(fields.reason)}
        runOnChangeInitially
      >
        <Select
          name='reason'
          label='Powód'
          options={reasons.map(item => ({
            label: translations.reportReasons[item],
            value: item,
          }))}
        />
        {selectedReason &&
          <Input
            name='description'
            label={translations.reportDescriptions[selectedReason]}
            multiline
          />
        }
        <FormButton
          variant='contained'
          color='primary'
          callback={async fields => {
            setLoading(true)
            try {
              await handleReport(fields)
              onClose()
            } catch (err) {
              console.error(err)
              setLoading(false)
            }
          }}
          loading={loading}
        >Wyślij</FormButton>
      </Form>
    </Modal>
  )
}

export default Report
