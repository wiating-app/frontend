import React from 'react'
import { withFormControl } from 'react-standalone-form-mui'
import { useSnackbar } from 'notistack'
import convert from 'geo-coordinates-parser'
import { Input } from '@material-ui/core'


const CoordinatesInput = ({
  name,
  value,
  placeholder,
  required,
  multiline,
  setValue,
}) => {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <Input
      id={name}
      onChange={e => {
        const { value } = e.target
        if (value) {
          try {
            const { decimalLatitude, decimalLongitude } = convert(value)
            const stringifiedValue = [
              decimalLatitude.toString(),
              decimalLongitude.toString(),
            ]
            setValue(name, stringifiedValue, required)
            enqueueSnackbar(
              `Przystosowano koordynaty ${value} do systemu decymalnego.`,
              { variant: 'success', anchorOrigin: { vertical: 'bottom', horizontal: 'left' } }
            )
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
