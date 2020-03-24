import React from 'react'
import translationsFile from './translations'

export const LanguageContext = React.createContext([null, () => {}])

export const LanguageProvider = ({ children }) => {
  const [translations, setTranslations] = React.useState({
    id: 'en',
    ...translationsFile.en,
  })

  const setLanguage = language => {
    localStorage.setItem('language', language)
    setTranslations({
      id: language,
      ...translationsFile[language],
    })
  }

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  return (
    <LanguageContext.Provider value={[translations, setLanguage]}>
      {children}
    </LanguageContext.Provider>
  )
}

const useLanguage = () => {
  const [translations, setLanguage] = React.useContext(LanguageContext)
  return {
    translations,
    language: translations.id,
    setLanguage,
  }
}

export default useLanguage
