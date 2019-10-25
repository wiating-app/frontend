import React from 'react'
import { useAuth0 } from '../react-auth0-wrapper'
import NavBar from '../components/NavBar'


const NavBarContainer = props => {
  const {
    loading,
    loginWithRedirect,
    user,
    logout,
  } = useAuth0()

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <NavBar
      onSearch={phrase => props.onSearch(phrase)}
      loginWithRedirect={loginWithRedirect}
      user={user}
      logout={logout}
    />
  )
}

export default NavBarContainer
