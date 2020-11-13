import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { Auth0Provider } from './utils/useAuth0'
import history from './history'
import enableServiceWorker from './enableServiceWorker'
import { LanguageProvider } from './utils/useLanguage'
import FormThemeProvider from './utils/FormThemeProvider'
import { CurrentLocationProvider } from './utils/useCurrentLocation'
import theme from './theme'

const App = React.lazy(() => import('./App'))
const Maintenance = React.lazy(() => import('./components/Maintenance'))


ReactDOM.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        {process.env.MAINTENANCE === 'true'
          ? <Maintenance />
          : <Router history={history}>
            <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <Auth0Provider
                domain={process.env.AUTH_DOMAIN}
                client_id={process.env.FRONTEND_AUTH_CLIENT}
                redirect_uri={window.location.origin}
                responseType='token id_token'
                getTokenSilently
              >
                <FormThemeProvider>
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
    </LanguageProvider>
  </React.Suspense>, document.getElementById('root'))

enableServiceWorker()
