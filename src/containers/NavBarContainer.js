import React from 'react'
import { useRecoilState } from 'recoil'
import { useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import {
  activeTypesState,
  searchResultsState,
  activeLocationState,
} from '../state'
import api from '../api'
import useAuth0 from '../utils/useAuth0'
import NavBar from '../components/NavBar'
import LanguageSwitcher from '../components/LanguageSwitcher'
import useLanguage from '../utils/useLanguage'
import serializeData from '../utils/serializeData'
import history from '../history'

const languages = ['pl', 'en']

const NavBarContainer = () => {
  const [languageSwitch, setLanguageSwitch] = React.useState()
  const [searchPhrase, setSearchPhrase] = React.useState()
  const [searchLoading, setSearchLoading] = React.useState()
  const [, setSearchResults] = useRecoilState(searchResultsState)
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations, language, setLanguage } = useLanguage()
  const [activeTypes] = useRecoilState(activeTypesState)

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
          setSearchResults(points.map(item => serializeData(item)))
          history.push('/search')
          setActiveLocation(null)
          setSearchLoading(false)
        }
      } else if (searchPhrase !== undefined) {
        history.push('/')
      }
    }
    handleAsync()
  }, [searchPhrase])

  // Set html document language.
  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const links = [
    ...isModerator ? [{ label: translations.administration, url: '/moderator/log' }] : [],
    ...isLoggedIn ? [
      {
        label: translations.history,
        url: '/history',
      },
      {
        label: <>{translations.language}: {language.toUpperCase()}</>,
        callback: () => setLanguageSwitch(true),
        divider: true,
      },
    ] : [],
    { label: translations.informations, url: '/info' },
    ...isMobile ? [{ label: translations.legend, url: '/legend' }] : [],
    { label: translations.termsAndConditions, url: '/regulations' },
    { label: translations.privacyPolicy, url: '/privacy-policy' },
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

export default NavBarContainer
