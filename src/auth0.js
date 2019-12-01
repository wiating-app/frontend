import React, { useState, useEffect, useContext } from 'react'
import { useSnackbar } from 'notistack'
import createAuth0Client from '@auth0/auth0-spa-js'
import api from './api'
import Text from './components/Text'


const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)


export const Auth0Provider = ({
  children,
  ...initOptions
}) => {
  const [auth0, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
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
        const completeUser = { ...user, token }
        localStorage.setItem('currentUser', JSON.stringify(completeUser))
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(completeUser)
        enqueueSnackbar(<Text id='auth.loginSuccessful' />, { variant: 'success' })
      } else {
        // Retrieve user from local storage on page init.
        const currentUser = localStorage.getItem('currentUser')
        setUser(currentUser ? JSON.parse(currentUser) : false)
      }

      setLoading(false)
    }
    initAuth0()
  }, [])

  return auth0
    ? <Auth0Context.Provider
      value={{
        loading,
        isLoggedIn: !!user,
        user,
        loginWithRedirect: p => {
          auth0.loginWithRedirect(p)
        },
        logout: p => {
          auth0.logout(p)
          api.defaults.headers.common['Authorization'] = null
          localStorage.removeItem('currentUser')
        },
        setStoredPosition: position => {
          localStorage.setItem('lastPosition', JSON.stringify(position))
        },
        getStoredPosition: () => {
          try {
            const position = localStorage.getItem('lastPosition')
            return position ? JSON.parse(position) : false
          } catch (error) {
            localStorage.removeItem('currentUser')
            return false
          }
        },
      }}
    >
      {children}
    </Auth0Context.Provider>
    : <div><Text id='loading' />...</div>
}
