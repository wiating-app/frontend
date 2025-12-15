import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import parse from 'coord-parser'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'
import { searchPoints } from '../api/searchPoints'
import LanguageSwitcher from '../components/LanguageSwitcher'
import NavBar from '../components/NavBar'
import history from '../history'
import { activeTypesState } from '../state'
import useAuth0 from '../utils/useAuth0'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'

const languages = ['pl', 'en']

const NavBarContainer = () => {
  const [languageSwitch, setLanguageSwitch] = React.useState(false)
  const [searchPhrase, setSearchPhrase] = React.useState<string>()
  const queryClient = useQueryClient()
  const { translations, language, setLanguage } = useLanguage()
  const [activeTypes] = useRecoilState(activeTypesState)
  const { faq, termsAndConditions } = useConfig()

  const { loginWithRedirect, user, isLoggedIn, isModerator, logout } = useAuth0()

  const searchMutation = useMutation({
    mutationFn: (params: Parameters<typeof searchPoints>[0]) => searchPoints(params),
    onSuccess: points => {
      queryClient.setQueryData(['searchResults'], points)
      history.push('/search')
    },
  })

  React.useEffect(() => {
    if (searchPhrase === undefined) return

    if (!searchPhrase) {
      history.push('/')
      return
    }

    if (searchPhrase.length <= 3) {
      toast.error(translations.atLeast4Characters)
      return
    }

    // Debounce search requests
    const timeoutId = setTimeout(() => {
      let coords:
        | {
            top_right: { lat: number; lon: number }
            bottom_left: { lat: number; lon: number }
          }
        | false = false
      // Check wheter given input are geo coordinates.
      try {
        const { lat, lon } = parse(searchPhrase)
        const rounded = {
          lat: Number(lat.toFixed(1)),
          lon: Number(lon.toFixed(1)),
        }
        coords = {
          top_right: {
            lat: rounded.lat + 0.1,
            lon: rounded.lon + 0.1,
          },
          bottom_left: {
            lat: rounded.lat - 0.1,
            lon: rounded.lon - 0.1,
          },
        }
      } catch {}
      searchMutation.mutate({
        ...(coords || { phrase: searchPhrase }),
        ...(activeTypes.length ? { point_type: activeTypes } : {}),
      })
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchPhrase, activeTypes])

  // Set html document language.
  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const links = [
    ...(isModerator ? [{ label: translations.administration, url: '/moderator/log' }] : []),
    ...(isLoggedIn
      ? [
          {
            label: translations.history,
            url: '/history',
          },
          {
            label: translations.wrapped,
            url: '/wrapped',
          },
          {
            label: (
              <>
                {translations.language}: {language.toUpperCase()}
              </>
            ),
            callback: () => setLanguageSwitch(true),
            divider: true,
          },
        ]
      : []),
    { label: translations.informations, url: '/info' },
    ...(termsAndConditions ? [{ label: translations.termsAndConditions, url: '/terms-and-conditions' }] : []),
    { label: translations.privacyPolicy, url: '/privacy-policy' },
    ...(faq ? [{ label: translations.faq, url: '/faq', divider: true }] : []),
    {
      label: translations[isLoggedIn ? 'logout' : 'login'],
      callback: () => (isLoggedIn ? logout() : loginWithRedirect({})),
    },
  ]

  return (
    <>
      {languageSwitch && (
        <LanguageSwitcher
          language={language}
          languages={languages}
          setLanguage={setLanguage}
          onClose={() => setLanguageSwitch(false)}
        />
      )}
      <NavBar
        onSearch={setSearchPhrase}
        searchLoading={searchMutation.isLoading}
        isLoggedIn={isLoggedIn}
        user={user}
        links={links}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
    </>
  )
}

export default NavBarContainer
