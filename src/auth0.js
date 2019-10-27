import React, { useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'


const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)


export const Auth0Provider = ({
  children,
  ...initOptions
}) => {
  const [auth0, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()

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
        setUser(completeUser)
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
          localStorage.removeItem('currentUser')
        },
        setStoredPosition: (lat, lng, zoom) => {
          localStorage.setItem('lastPosition', lat + ';' + lng + ';' + zoom)
        },
        getStoredPosition: () => {
          const position = localStorage.getItem('lastPosition')
          return position ? position.split(';') : false
        },
      }}
    >
      {children}
    </Auth0Context.Provider>
    : <div>Loading...</div>
}
