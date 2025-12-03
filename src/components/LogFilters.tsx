import Form from 'react-form-component'
import SubmitButton from './Inputs/SubmitButton'
import Input from './Inputs/Input'
import Select from './Inputs/Select'
import React from 'react'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'

interface LogFiltersProps {
  values?: {
    id?: string
    reviewed_at?: boolean
    [key: string]: any
  }
  handleSubmit: (fields: any) => void
  handleReset: () => void
}

const LogFilters = ({ values = {}, handleSubmit, handleReset }: LogFiltersProps) => {
  const { translations } = useLanguage()
  const { settings: { enableVerification } } = useConfig()

  const hasActiveFilters = (values.id && values.id.trim() !== '') ||
    values.reviewed_at !== undefined

  // Create a key based on filter values to force Form remount when values change
  // This ensures the form fields reset properly when filters are cleared
  const formKey = JSON.stringify({
    id: values.id ?? null,
    reviewed_at: values.reviewed_at ?? null,
  })

  return (
    <Form
      key={formKey}
      fields={['id', 'reviewed_at']}
      className="mb-6"
    >
      <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded">
        <div className="max-sm:flex-1 sm:w-5/12 md:w-4/12">
          <Input
            name='id'
            placeholder={translations.findById}
            initialValue={values.id}
            noBottomGutter
          />
        </div>
        {enableVerification &&
          <div className="w-full sm:w-4/12 md:w-3/12">
            <Select
              name='reviewed_at'
              label={translations.verificationState}
              options={[
                { label: translations.verified, value: 'true' },
                { label: translations.unverified, value: 'false' },
              ]}
              placeholder={translations.all}
              initialValue={values.reviewed_at?.toString()}
              noBottomGutter
            />
          </div>
        }
        {hasActiveFilters && (
          <div>
            <SubmitButton onClick={handleReset}>{translations.reset}</SubmitButton>
          </div>
        )}
        <SubmitButton
          variant='primary'
          onClick={handleSubmit}
        >{translations.filter}</SubmitButton>
      </div>
    </Form>
  )
}

export default LogFilters
