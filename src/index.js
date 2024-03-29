import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@material-ui/core'
import { RecoilRoot } from 'recoil'
import { Auth0Provider } from './utils/useAuth0'
import history from './history'
import enableServiceWorker from './enableServiceWorker'
import ErrorHandler from './utils/ErrorHandler'
import { LanguageProvider } from './utils/useLanguage'
import { ConfigProvider } from './utils/useConfig'
import FormThemeProvider from './utils/FormThemeProvider'
import { UserLocationProvider } from './utils/useUserLocation'
import ThemeProvider from './ThemeProvider'

const App = React.lazy(() => import('./App'))
const Maintenance = React.lazy(() => import('./components/Maintenance'))


ReactDOM.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <ErrorHandler>
      <RecoilRoot>
        <ConfigProvider>
          <LanguageProvider>
            <ThemeProvider>
              {process.env.FRONTEND_MAINTENANCE === 'true'
                ? <Maintenance />
                : <Router history={history}>
                  <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    autoHideDuration={3000}
                  >
                    <Auth0Provider
                      domain={process.env.AUTH0_DOMAIN}
                      client_id={process.env.FRONTEND_AUTH0_CLIENT}
                      redirect_uri={window.location.origin}
                      responseType='token id_token'
                      getTokenSilently
                    >
                      <FormThemeProvider>
                        <CssBaseline />
                        <UserLocationProvider>
                          <App />
                        </UserLocationProvider>
                      </FormThemeProvider>
                    </Auth0Provider>
                  </SnackbarProvider>
                </Router>
              }
            </ThemeProvider>
          </LanguageProvider>
        </ConfigProvider>
      </RecoilRoot>
    </ErrorHandler>
  </React.Suspense>, document.getElementById('root'))

enableServiceWorker()
