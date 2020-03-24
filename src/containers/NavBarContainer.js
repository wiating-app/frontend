import React from 'react'
import { withRouter } from 'react-router-dom'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import NavBar from '../components/NavBar'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Text from '../components/Text'
import { LanguageContext } from '../utils/TranslationsProvider'

const languages = ['pl', 'en']

const NavBarContainer = ({ setSearchResults, history }) => {
  const [language, setLanguage] = React.useContext(LanguageContext)
  const [languageSwitch, setLanguageSwitch] = React.useState()
  const {
    loading,
    loginWithRedirect,
    user,
    isLoggedIn,
    isModerator,
    logout,
  } = useAuth0()

  const onSearch = async phrase => {
    if (phrase) {
      const { data: { points } } = await api.post('search_points', { phrase })
      setSearchResults(points)
      history.push('/search')
    } else {
      history.push('/')
    }
  }

  const links = [
    ...isModerator ? [{ label: <Text id='administration' />, url: '/log' }] : [],
    ...isLoggedIn ? [{
      label: <><Text id='language' />: {language.toUpperCase()}</>,
      callback: () => setLanguageSwitch(true),
      divider: true,
    }] : [],
    { label: <Text id='informations' />, url: '/info' },
    { label: <Text id='termsAndConditions' />, url: '/regulamin' },
    { label: <Text id='privacyPolicy' />, url: '/polityka-prywatnosci', divider: true },
    {
      label: <Text id={isLoggedIn ? 'auth.logout' : 'auth.login'} />,
      callback: () => isLoggedIn ? logout() : loginWithRedirect({}),
    },
  ]

  return (
    <>
      {languageSwitch &&
        <LanguageSwitcher
          language={language}
          languages={languages}
          setLanguage={setLanguage}
          onClose={() => setLanguageSwitch(false)}
        />
      }
      <NavBar
        onSearch={phrase => onSearch(phrase)}
        isLoggedIn={isLoggedIn}
        user={user}
        loading={loading}
        links={links}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
    </>
  )
}

export default withRouter(NavBarContainer)
