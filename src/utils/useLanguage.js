import React from 'react'
import translationsFile from './translations'

export const LanguageContext = React.createContext([null, () => {}])

export const LanguageProvider = ({ children }) => {
  const [translations, setTranslations] = React.useState(null)

  const setLanguage = language => {
    localStorage.setItem('language', language)
    setTranslations({
      id: language,
      ...translationsFile[language],
    })
  }

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    setLanguage(storedLanguage || {
      id: 'en',
      ...translationsFile.en,
    })
  }, [])

  return (
    <LanguageContext.Provider value={[translations, setLanguage]}>
      {translations && children}
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
