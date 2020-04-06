import React from 'react'
import { FormThemeProvider as RSFFormThemeProvider } from 'react-standalone-form'
import { useSnackbar } from 'notistack'
import parse from 'coord-parser'


const FormThemeProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()

  const theme = {
    errorNotificationFunc: message => enqueueSnackbar(message, { variant: 'error' }),
    customValidationFunction: (value, type) => {
      // Custom validation rules should return false or string with error message.
      switch (type) {
        case 'coordinates':
          // Rule for coordinates input:
          try {
            parse(value)
            return false
          } catch (err) {
            return 'Niepoprawny format współrzędnych.'
          }

        default:
          return false
      }
    },
  }

  return (
    <RSFFormThemeProvider theme={theme}>
      {children}
    </RSFFormThemeProvider>
  )
}

export default FormThemeProvider
