import React from 'react'
import api from '../api'
import { useAuth0 } from '../auth0'
import NavBar from '../components/NavBar'

const NavBarContainer = ({
  setSearchResults,
  setLocationTabContent,
}) => {
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
    if (phrase) {
      const { data: { points } } = await api.post('search_points', { phrase })
      setSearchResults(points)
      setLocationTabContent('searchResults')
    } else {
      setLocationTabContent(null)
    }
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
