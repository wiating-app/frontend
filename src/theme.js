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
})

export default theme
