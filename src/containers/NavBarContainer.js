import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'
import { useAuth0 } from '../auth0'
import NavBar from '../components/NavBar'
import { LanguageContext } from '../containers/TranslationsProvider'

const languages = ['pl', 'en']

const NavBarContainer = ({ setSearchResults, history }) => {
  const [language, setLanguage] = React.useContext(LanguageContext)
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
      history.push('/search')
    } else {
      history.push('/')
    }
  }

  return (
    <NavBar
      onSearch={phrase => onSearch(phrase)}
      loginWithRedirect={loginWithRedirect}
      user={user}
      logout={logout}
      language={language}
      languages={languages}
      setLanguage={setLanguage}
    />
  )
}

export default withRouter(NavBarContainer)
