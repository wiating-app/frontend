import React from 'react'
import { withFormControl } from '@react-form-component/mui'
import { TextField, InputAdornment } from '@material-ui/core'


interface CoordinatesInputProps {
  name: string
  value?: string
  label?: string
  placeholder?: string
  mandatory?: boolean
  setValue: (name: string, value: string, mandatory?: boolean, options?: any) => void
  onChange?: (value: string) => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const CoordinatesInput = ({
  name,
  value,
  label,
  placeholder,
  mandatory,
  setValue,
  onChange,
  prefix,
  suffix,
}: CoordinatesInputProps) =>
  <TextField
    id={name}
    onChange={e => {
      const { value } = e.target
      setValue(name, value, mandatory, { type: 'coordinates' })
      onChange && onChange(value)
    }}
    value={value || ''}
    label={label}
    placeholder={placeholder}
    InputProps={{
      startAdornment: prefix
        ? <InputAdornment position='start'>{prefix}</InputAdornment>
        : null,
      endAdornment: suffix
        ? <InputAdornment position='end'>{suffix}</InputAdornment>
        : null,
    }}
  />

export default withFormControl(CoordinatesInput)

