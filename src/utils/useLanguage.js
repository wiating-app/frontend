import React from 'react'
import translationsFile from './translations'
import detectUserLanguage from './detectUserLanguage'

export const LanguageContext = React.createContext([null, () => {}])

export const LanguageProvider = ({ children }) => {
  const [translations, setTranslations] = React.useState(null)

  const setLanguage = language => {
    setTranslations({
      id: language,
      ...translationsFile[language],
    })
    localStorage.setItem('language', language)
  }

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    // TODO: Remove it after all testers visited the page again.
    // setLanguage((storedLanguage && Object.keys(translationsFile).includes(storedLanguage))
    //   ? storedLanguage
    //   : detectUserLanguage()
    // )
    setLanguage(detectUserLanguage())
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
    languages: Object.keys(translationsFile),
  }
}

export default useLanguage
