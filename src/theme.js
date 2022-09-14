import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4c4c42',
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

export default theme
