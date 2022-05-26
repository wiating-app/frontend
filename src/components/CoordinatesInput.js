import React from 'react'
import { withFormControl } from 'react-form-component-mui'
import { Input, InputAdornment } from '@material-ui/core'


const CoordinatesInput = ({
  name,
  value,
  placeholder,
  mandatory,
  setValue,
  onChange,
  addon,
}) =>
  <Input
    id={name}
    onChange={e => {
      const { value } = e.target
      setValue(name, value, mandatory, { type: 'coordinates' })
      onChange && onChange(value)
    }}
    value={value || ''}
    placeholder={placeholder}
    startAdornment={addon
      ? <InputAdornment position='start'>{addon}</InputAdornment>
      : null
    }
  />

export default withFormControl(CoordinatesInput)
