import React, { useState, useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'
import createAuth0Client from '@auth0/auth0-spa-js'
import api from './api'
import Text from './components/Text'

// Useful info about Auth0Provider configuration:
// https://auth0.com/docs/quickstart/spa/react

const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)


export const Auth0Provider = ({
  children,
  ...initOptions
}) => {
  const [auth0, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  const [isLoggedIn, setIsLoggedIn] = React.useState()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      // Log in with redirect after successfull authentication
      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        window.history.replaceState(
          {},
          document.title,
          appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
        )

        const user = await auth0FromHook.getUser()
        const token = await auth0FromHook.getTokenSilently()
        const isAuthenticated = await auth0FromHook.isAuthenticated()
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        setIsLoggedIn(isAuthenticated || false)
        enqueueSnackbar(<Text id='auth.loginSuccessful' />, { variant: 'success' })
      } else {
        // Retrieve user from local storage on page init.
        const user = await auth0FromHook.getUser()
        const token = await auth0FromHook.getTokenSilently()
        const isAuthenticated = await auth0FromHook.isAuthenticated()
        setUser(user || false)
        setIsLoggedIn(isAuthenticated || false)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      setLoading(false)
    }
    initAuth0()
  }, [])

  return auth0
    ? <Auth0Context.Provider
      value={{
        loading,
        isLoggedIn,
        user,
        loginWithRedirect: p => {
          auth0.loginWithRedirect(p)
        },
        logout: p => {
          auth0.logout(p)
          api.defaults.headers.common['Authorization'] = null
        },
        setStoredPosition: position => {
          localStorage.setItem('lastPosition', JSON.stringify(position))
        },
        getStoredPosition: () => {
          try {
            const position = localStorage.getItem('lastPosition')
            return position ? JSON.parse(position) : false
          } catch (error) {
            return false
          }
        },
      }}
    >
      {children}
    </Auth0Context.Provider>
    : <div>Loading...</div>
}
