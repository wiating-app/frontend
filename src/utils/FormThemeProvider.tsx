import React from 'react'
import { FormThemeProvider as RFCFormThemeProvider } from '@react-form-component/mui'
import { useSnackbar } from 'notistack'
import parse from 'coord-parser'
import useLanguage from './useLanguage'

interface FormThemeProviderProps {
  children: React.ReactNode
}

const FormThemeProvider = ({ children }: FormThemeProviderProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  const theme = {
    textLabels: translations?.formLabels,
    errorNotificationFunc: (message: string) => enqueueSnackbar(message, { variant: 'error' }),
    customValidationFunction: (value: string, type: string): boolean | string => {
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
  } as any

  return (
    <RFCFormThemeProvider theme={theme}>
      {children}
    </RFCFormThemeProvider>
  )
}

export default FormThemeProvider

