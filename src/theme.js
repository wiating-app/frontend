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
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: 36,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 40,
      },
    },
  },
})

export default theme
