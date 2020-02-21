import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4c4c42',
    },
  },
  layout: {
    locationTabWidth: 400,
    mobileMiniMapHeight: 240,
  },
  overrides: {
    MuiFormControl: {
      root: {
        marginBottom: '16px !important',
      },
    },
  },
})

export default theme
