import React from 'react'
import useAuth0 from './useAuth0'

interface RequireAuthProps {
  redirect?: boolean
  children: React.ReactNode
}

const RequireAuth = ({ redirect = false, children }: RequireAuthProps) => {
  const { isLoggedIn, requireAuth } = useAuth0()

  React.useEffect(() => {
    requireAuth(() => {}, redirect)
  }, [requireAuth, redirect])

  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}

export default RequireAuth
