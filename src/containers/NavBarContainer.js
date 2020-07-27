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

const NavBarContainer = ({ setSearchResults, activeTypes, history }) => {
  const [languageSwitch, setLanguageSwitch] = React.useState()
  const [searchPhrase, setSearchPhrase] = React.useState()
  const [searchLoading, setSearchLoading] = React.useState()
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

  React.useEffect(() => {
    const handleAsync = async () => {
      if (searchPhrase) {
        if (searchPhrase.length > 3) {
          setSearchLoading(true)
          const { data: { points } } = await api.post('search_points', {
            phrase: searchPhrase,
            // eslint-disable-next-line camelcase
            ...activeTypes.length ? { point_type: activeTypes } : {},
          })
          setSearchResults(points)
          history.push('/search')
          setSearchLoading(false)
        }
      } else if (searchPhrase !== undefined) {
        history.push('/')
      }
    }
    handleAsync()
  }, [searchPhrase])

  const links = [
    ...isModerator ? [{ label: translations.administration, url: '/administracja' }] : [],
    ...isLoggedIn ? [{
      label: <>{translations.language}: {language.toUpperCase()}</>,
      callback: () => setLanguageSwitch(true),
      divider: true,
    }] : [],
    { label: translations.informations, url: '/info' },
    ...isMobile ? [{ label: translations.legend, url: '/legenda' }] : [],
    { label: translations.termsAndConditions, url: '/regulamin' },
    { label: translations.privacyPolicy, url: '/polityka-prywatnosci' },
    { label: translations.faq, url: '/faq', divider: true },
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
        onSearch={setSearchPhrase}
        searchLoading={searchLoading}
        isLoggedIn={isLoggedIn}
        user={user}
        authLoading={loading}
        links={links}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
    </>
  )
}

export default withRouter(NavBarContainer)
