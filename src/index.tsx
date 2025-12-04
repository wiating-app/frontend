import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import { Toaster } from 'sonner'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Auth0Provider } from './utils/useAuth0'
import history from './history'
import enableServiceWorker from './enableServiceWorker'
import ErrorHandler from './utils/ErrorHandler'
import { LanguageProvider } from './utils/useLanguage'
import { ConfigProvider } from './utils/useConfig'
import FormThemeProvider from './utils/FormThemeProvider'
import { UserLocationProvider } from './utils/useUserLocation'
import { queryClient } from './utils/queryClient'
import './App.css'

const App = React.lazy(() => import('./App'))
const Maintenance = React.lazy(() => import('./components/Maintenance'))

ReactDOM.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <ErrorHandler>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider>
            <LanguageProvider>
              {process.env.FRONTEND_MAINTENANCE === 'true'
                ? <Maintenance />
                : <Router history={history}>
                  <Auth0Provider
                    domain={process.env.AUTH0_DOMAIN}
                    client_id={process.env.FRONTEND_AUTH0_CLIENT}
                    redirect_uri={window.location.origin}
                    responseType='token id_token'
                    getTokenSilently
                  >
                    <FormThemeProvider>
                      <UserLocationProvider>
                        <App />
                      </UserLocationProvider>
                    </FormThemeProvider>
                    <Toaster position="bottom-center" />
                  </Auth0Provider>
                </Router>
              }
            </LanguageProvider>
          </ConfigProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </RecoilRoot>
    </ErrorHandler>
  </React.Suspense>, document.getElementById('root'))

enableServiceWorker()
