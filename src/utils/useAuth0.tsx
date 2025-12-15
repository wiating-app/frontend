import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import createAuth0Client, { Auth0ClientOptions } from '@auth0/auth0-spa-js'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '../api'
import Loader from '../components/Loader'
import history from '../history'
import { Auth0ContextInterface, User } from '../typings'
import useLanguage from './useLanguage'

// Useful info about Auth0Provider configuration:
// https://auth0.com/docs/quickstart/spa/react

const Auth0Context = React.createContext<Auth0ContextInterface | undefined>(undefined)

interface Auth0ProviderProps extends Auth0ClientOptions {
  children: React.ReactNode
}

export const Auth0Provider = ({ children, ...initOptions }: Auth0ProviderProps) => {
  const queryClient = useQueryClient()
  const [auth0, setAuth0] = useState<any>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isModerator, setIsModerator] = useState(false)
  const { translations } = useLanguage()

  const user = queryClient.getQueryData<User | null>(['user']) ?? null
  const setUser = useCallback(
    (userData: User | null) => {
      queryClient.setQueryData(['user'], userData)
    },
    [queryClient],
  )

  // Calculate canSeeWrapped: only for logged-in users from December 13th to January 31st
  const canSeeWrapped = useMemo(() => {
    if (!isLoggedIn) {
      return false
    }
    const now = new Date()
    const currentMonth = now.getMonth() // 0-11 (0 = January, 11 = December)
    const currentDay = now.getDate() // 1-31

    // December 13-31
    if (currentMonth === 11 && currentDay >= 13) {
      return true
    }
    // January 1-31
    if (currentMonth === 0 && currentDay <= 31) {
      return true
    }
    return false
  }, [isLoggedIn])

  useEffect(() => {
    // Check for service worker update notification
    const isUpdateReload = sessionStorage.getItem('sw-update-reload')
    if (isUpdateReload) {
      sessionStorage.removeItem('sw-update-reload')
      toast(translations?.youAreNowUsingLatestVersion)
    }

    const initAuth0 = async () => {
      try {
        const checkModerator = (userData: User | null) => {
          if (
            userData &&
            (userData as any)[process.env.FRONTEND_AUTH0_METADATA_OBJECT_KEY as string] &&
            (userData as any)[process.env.FRONTEND_AUTH0_METADATA_OBJECT_KEY as string].role ===
              process.env.FRONTEND_AUTH0_MODERATOR_ROLE
          ) {
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
            appState && appState.targetUrl ? appState.targetUrl : window.location.pathname,
          )

          const userData = await auth0FromHook.getUser()
          const token = await auth0FromHook.getTokenSilently()
          const isAuthenticated = await auth0FromHook.isAuthenticated()
          api.defaults.headers.common.Authorization = `Bearer ${token}`
          setUser((userData as User) || null)
          setIsLoggedIn(isAuthenticated || false)
          checkModerator((userData as User) || null)
          toast.success(translations?.loginSuccessful)
        } else {
          // Restore user session from auth0.
          const isAuthenticated = await auth0FromHook.isAuthenticated()
          if (isAuthenticated) {
            const userData = await auth0FromHook.getUser()
            const token = await auth0FromHook.getTokenSilently()
            api.defaults.headers.common.Authorization = `Bearer ${token}`
            setUser((userData as User) || null)
            setIsLoggedIn(isAuthenticated || false)
            checkModerator((userData as User) || null)
          }
        }
      } catch (err) {
        console.error(err)
        toast.error(translations?.couldNotRestoreSession)
        setIsLoggedIn(false)
      }
    }
    initAuth0()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initOptions and translations are stable, effect should only run on mount
  }, [setUser])

  const contextValue: Auth0ContextInterface = {
    isLoggedIn,
    isModerator,
    canSeeWrapped,
    user: user || undefined,
    popupOpen: false,
    loginWithPopup: async () => {},
    handleRedirectCallback: async () => ({}) as any,
    loginWithRedirect: async () => {},
    getTokenSilently: async () => undefined,
    getTokenWithPopup: async () => undefined,
    logout: () => {},
    getIdTokenClaims: async () => undefined,
    __onUnload: () => {},
    setStoredPosition: ({
      bounds,
      zoom,
    }: {
      center?: [number, number]
      zoom?: number
      bounds?: L.LatLngBoundsExpression
    }) => {
      if (bounds && 'getNorthEast' in bounds && 'getSouthWest' in bounds) {
        const _northEast = bounds.getNorthEast()
        const _southWest = bounds.getSouthWest()
        const safeBounds = [
          [_northEast.lat, _northEast.lng],
          [_southWest.lat, _southWest.lng],
        ]
        localStorage.setItem(
          'lastPosition',
          JSON.stringify({
            bounds: safeBounds,
            zoom,
          }),
        )
      }
    },
    getStoredPosition: () => {
      try {
        const storedPosition = JSON.parse(localStorage.getItem('lastPosition') || 'null')
        // Make sure that structure is correct.
        return storedPosition?.bounds ? storedPosition : null
      } catch {
        return null
      }
    },
    requireAuth: (callback: () => void, redirect: boolean = false) => {
      if (!isLoggedIn) {
        toast(translations?.mustLogIn, {
          action: {
            label: translations?.login,
            onClick: () => {
              if (auth0) {
                auth0.loginWithRedirect({})
              } else {
                contextValue.loginWithRedirect({})
              }
            },
          },
        })
        if (redirect) {
          history.push('/')
        }
      } else {
        callback()
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
      api.defaults.headers.common.Authorization = null as any
      queryClient.setQueryData(['user'], null)
      queryClient.setQueryData(['userLogs'], null)
      queryClient.setQueryData(['logs'], null)
      queryClient.setQueryData(['reports'], null)
      queryClient.setQueryData(['unpublished'], null)
      queryClient.setQueryData(['wrapped'], null)
      queryClient.setQueryData(['wrappedLocation'], null)
      setIsModerator(false)
    }
    contextValue.getTokenSilently = async (options?: any) => {
      return await auth0.getTokenSilently(options)
    }
  }

  if (isLoggedIn === null) {
    return <Loader big fullscreen />
  }

  return <Auth0Context.Provider value={contextValue}>{children}</Auth0Context.Provider>
}

const useAuth0 = (): Auth0ContextInterface => {
  const context = useContext(Auth0Context)
  if (!context) {
    throw new Error('useAuth0 must be used within an Auth0Provider')
  }
  return context
}

export default useAuth0
