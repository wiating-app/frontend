import React from 'react'
import { withFormControl } from 'react-standalone-form-mui'
import { Input } from '@material-ui/core'
import { parseCoordinates } from '../utils/parseCoordinates'

const CoordinatesInput = ({
  name,
  value,
  placeholder,
  required,
  multiline,
  setValue,
}) => {
  return (
    <Input
      id={name}
      onChange={e => {
        const { value } = e.target
        if (value) {
          try {
            const parsedValue = parseCoordinates(value)
            const stringifiedValue = [
              parsedValue[0].toString(),
              parsedValue[1].toString(),
            ]
            setValue(name, stringifiedValue, required)
          } catch (err) {
            setValue(name, value, required, { forcedErrorMessage: err.message })
          }
        } else {
          setValue(name, '', required)
        }
      }}
      value={typeof value === 'object' ? `${value[0]},${value[1]}` : value || ''}
      placeholder={placeholder}
      multiline={multiline}
    />
  )
}

export default withFormControl(CoordinatesInput)
