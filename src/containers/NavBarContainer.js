import React from 'react'
import { API } from '../api'
import { useAuth0 } from '../auth0'
import NavBar from '../components/NavBar'

const api = new API()

const NavBarContainer = ({ setSearchResults }) => {
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

  const onSearch = async phrase => {
    const result = await api.search(phrase)
    setSearchResults(result)
  }

  return (
    <NavBar
      onSearch={phrase => onSearch(phrase)}
      loginWithRedirect={loginWithRedirect}
      user={user}
      logout={logout}
    />
  )
}

export default NavBarContainer
