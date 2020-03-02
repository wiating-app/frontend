import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { FormThemeProvider } from 'react-standalone-form'
import App from './App'
import { Auth0Provider } from './utils/auth0Provider'
import history from './history'
import enableServiceWorker from './enableServiceWorker'
import TranslationsProvider from './utils/TranslationsProvider'
import CurrentLocationProvider from './utils/CurrentLocationProvider'
import theme from './theme'
import formTheme from './utils/formTheme'
import Maintenance from './components/Maintenance'


ReactDOM.render(
  <TranslationsProvider>
    <ThemeProvider theme={theme}>
      {process.env.MAINTENANCE === 'true'
        ? <Maintenance />
        : <Router history={history}>
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Auth0Provider
              domain={process.env.REACT_APP_AUTH_DOMAIN}
              client_id={process.env.REACT_APP_AUTH_CLIENT}
              redirect_uri={window.location.origin}
              responseType='token id_token'
              getTokenSilently
            >
              <FormThemeProvider theme={formTheme}>
                <CssBaseline />
                <CurrentLocationProvider>
                  <App />
                </CurrentLocationProvider>
              </FormThemeProvider>
            </Auth0Provider>
          </SnackbarProvider>
        </Router>
      }
    </ThemeProvider>
  </TranslationsProvider>, document.getElementById('root'))

enableServiceWorker()
