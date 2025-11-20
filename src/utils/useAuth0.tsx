import React, { useContext, useEffect, useState } from 'react'
import api from '../api'
import createAuth0Client, { Auth0ClientOptions } from '@auth0/auth0-spa-js'
import useLanguage from './useLanguage'
import { useSnackbar } from 'notistack'
import { Auth0ContextInterface, User } from '../typings'

// Useful info about Auth0Provider configuration:
// https://auth0.com/docs/quickstart/spa/react

const Auth0Context = React.createContext<Auth0ContextInterface | undefined>(undefined)

interface Auth0ProviderProps extends Auth0ClientOptions {
  children: React.ReactNode
}

export const Auth0Provider = ({
  children,
  ...initOptions
}: Auth0ProviderProps) => {
  const [auth0, setAuth0] = useState<any>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const checkModerator = (user: User | null) => {
          if (user && (user as any)[process.env.FRONTEND_AUTH0_METADATA_OBJECT_KEY as string] &&
            (user as any)[process.env.FRONTEND_AUTH0_METADATA_OBJECT_KEY as string].role === process.env.FRONTEND_AUTH0_MODERATOR_ROLE) {
            setIsModerator(true)
          }
        }
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
          setUser((user as User) || null)
          setIsLoggedIn(isAuthenticated || false)
          checkModerator((user as User) || null)
          enqueueSnackbar(translations?.loginSuccessful, { variant: 'success' })
        } else {
          // Restore user session from auth0.
          const isAuthenticated = await auth0FromHook.isAuthenticated()
          if (isAuthenticated) {
            const user = await auth0FromHook.getUser()
            const token = await auth0FromHook.getTokenSilently()
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser((user as User) || null)
            setIsLoggedIn(isAuthenticated || false)
            checkModerator((user as User) || null)
          }
        }
      } catch (err) {
        console.error(err)
        enqueueSnackbar(translations?.couldNotRestoreSession, { variant: 'error' })
      }

      setLoading(false)
    }
    initAuth0()
  }, [])

  const contextValue: Auth0ContextInterface = {
    loading,
    isLoggedIn,
    isModerator,
    user: user || undefined,
    popupOpen: false,
    loginWithPopup: async () => {},
    handleRedirectCallback: async () => ({} as any),
    loginWithRedirect: async () => {},
    getTokenSilently: async () => undefined,
    getTokenWithPopup: async () => undefined,
    logout: () => {},
    getIdTokenClaims: async () => undefined,
    __onUnload: () => {},
    setStoredPosition: ({ bounds, zoom }: { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression }) => {
      if (bounds && 'getNorthEast' in bounds && 'getSouthWest' in bounds) {
        const _northEast = bounds.getNorthEast()
        const _southWest = bounds.getSouthWest()
        const safeBounds = [
          [_northEast.lat, _northEast.lng],
          [_southWest.lat, _southWest.lng],
        ]
        localStorage.setItem('lastPosition', JSON.stringify({
          bounds: safeBounds,
          zoom,
        }))
      }
    },
    getStoredPosition: () => {
      try {
        const storedPosition = JSON.parse(localStorage.getItem('lastPosition') || 'null')
        // Make sure that structure is correct.
        return storedPosition?.bounds ? storedPosition : null
      } catch (error) {
        return null
      }
    },
  }

  // Override with actual auth0 methods when available
  if (auth0) {
    contextValue.loginWithRedirect = async (options?: any) => {
      await auth0.loginWithRedirect(options)
    }
    contextValue.logout = (options?: any) => {
      auth0.logout(options)
      api.defaults.headers.common['Authorization'] = null as any
    }
    contextValue.getTokenSilently = async (options?: any) => {
      return await auth0.getTokenSilently(options)
    }
  }

  return (
    <Auth0Context.Provider value={contextValue}>
      {children}
    </Auth0Context.Provider>
  )
}

const useAuth0 = (): Auth0ContextInterface => {
  const context = useContext(Auth0Context)
  if (!context) {
    throw new Error('useAuth0 must be used within an Auth0Provider')
  }
  return context
}

export default useAuth0

