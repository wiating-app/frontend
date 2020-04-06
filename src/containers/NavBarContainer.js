import React from 'react'
import { withRouter } from 'react-router-dom'
import { useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import NavBar from '../components/NavBar'
import LanguageSwitcher from '../components/LanguageSwitcher'
import useLanguage from '../utils/useLanguage'

const languages = ['pl', 'en']

const NavBarContainer = ({ setSearchResults, history }) => {
  const [languageSwitch, setLanguageSwitch] = React.useState()
  const { translations, language, setLanguage } = useLanguage()
  const {
    loading,
    loginWithRedirect,
    user,
    isLoggedIn,
    isModerator,
    logout,
  } = useAuth0()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const onSearch = async phrase => {
    if (phrase) {
      if (phrase.length > 3) {
        const { data: { points } } = await api.post('search_points', { phrase })
        setSearchResults(points)
        history.push('/search')
      }
    } else {
      history.push('/')
    }
  }

  const links = [
    ...isModerator ? [{ label: translations.administration, url: '/log' }] : [],
    ...isLoggedIn ? [{
      label: <>{translations.language}: {language.toUpperCase()}</>,
      callback: () => setLanguageSwitch(true),
      divider: true,
    }] : [],
    { label: translations.informations, url: '/info' },
    ...isMobile ? [{ label: translations.legend, url: '/legenda' }] : [],
    { label: translations.termsAndConditions, url: '/regulamin' },
    { label: translations.privacyPolicy, url: '/polityka-prywatnosci', divider: true },
    {
      label: translations.auth[isLoggedIn ? 'logout' : 'login'],
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
