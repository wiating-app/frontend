import React from 'react'
import { withFormControl } from 'react-standalone-form-mui'
import { Input } from '@material-ui/core'


const CoordinatesInput = ({
  name,
  value,
  placeholder,
  required,
  multiline,
  setValue,
}) =>
  <Input
    id={name}
    onChange={e => {
      const { value } = e.target
      setValue(name, value, required, { type: 'coordinates' })
    }}
    value={value || ''}
    placeholder={placeholder}
    multiline={multiline}
  />

export default withFormControl(CoordinatesInput)
