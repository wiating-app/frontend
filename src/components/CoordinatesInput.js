import React from 'react'
import { withFormControl } from 'react-standalone-form-mui'
import { useSnackbar } from 'notistack'
import parse from 'coord-parser'
import { Input } from '@material-ui/core'
import Text from './Text'


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
            const { lat, lon } = parse(value)
            const stringifiedValue = [
              lat.toString(),
              lon.toString(),
            ]
            setValue(name, stringifiedValue, required)
            enqueueSnackbar(
              `${value} - współrzędne zweryfikowane poprawnie.`,
              { variant: 'success', anchorOrigin: { vertical: 'bottom', horizontal: 'left' } }
            )
          } catch (err) {
            setValue(name, value, required, { forcedErrorMessage: <Text id='notifications.wrongCoordsFormat' /> })
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
