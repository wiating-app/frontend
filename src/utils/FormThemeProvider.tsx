import React from 'react'
import { FormThemeProvider as RFCFormThemeProvider } from 'react-form-component'
import { toast } from 'sonner'
import parse from 'coord-parser'
import useLanguage from './useLanguage'

interface FormThemeProviderProps {
  children: React.ReactNode
}

const FormThemeProvider = ({ children }: FormThemeProviderProps) => {
  const { translations } = useLanguage()

  const theme = {
    textLabels: translations?.formLabels,
    errorNotificationFunc: (message: string) => toast.error(message),
    customValidationFunction: (value: string, type: string): boolean | string => {
      // Custom validation rules should return false or string with error message.
      switch (type) {
        case 'coordinates':
          // Rule for coordinates input:
          try {
            parse(value)
            return false
          } catch (_err) {
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
