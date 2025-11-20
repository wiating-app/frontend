import Form, { SubmitButton, Input, Select } from '@react-form-component/mui'
import Modal from './Modal'
import React from 'react'
import { Typography } from '@material-ui/core'
import useLanguage from '../utils/useLanguage'

interface ReportProps {
  handleReport: (fields: { reason: string; description: string }) => void | Promise<void>
  onClose: () => void
}

const Report = ({ handleReport, onClose }: ReportProps) => {
  const [loading, setLoading] = React.useState(false)
  const [selectedReason, setSelectedReason] = React.useState<string>()
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
        allMandatory
        onChange={(fields: any) => setSelectedReason(fields.reason)}
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
        <SubmitButton
          {...({ variant: 'contained' } as any)}
          color='primary'
          onClick={async (fields: any) => {
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
        >Wyślij</SubmitButton>
      </Form>
    </Modal>
  )
}

export default Report
