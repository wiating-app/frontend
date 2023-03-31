import React from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import useConfig from './utils/useConfig'


const ThemeProvider = ({ children }) => {
  const { branding: { themeColor } } = useConfig()

  const theme = createTheme({
    palette: {
      primary: {
        main: themeColor,
      },
    },
    layout: {
      locationTabWidth: 400,
      mobileMiniMapHeight: 200,
    },
    props: {
      MuiTextField: {
        variant: 'outlined',
      },
      MuiFormControl: {
        margin: 'normal',
        variant: 'outlined',
      },
    },
    overrides: {
      MuiFormControl: {
        root: {
          width: '100%',
        },
      },
      MuiListItemIcon: {
        root: {
          minWidth: 40,
          marginTop: -10,
          marginBottom: -10,
          transform: 'translateY(5px)',
        },
      },
    },
  })

  return (
    <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
  )
}

export default ThemeProvider
