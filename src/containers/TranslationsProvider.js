import React from 'react'
import detectUserLanguage from '../utils/detectUserLanguage'
import texts from '../utils/texts'


export const TranslationsContext = React.createContext([null, () => {}])
export const LanguageContext = React.createContext([null, () => {}])


const TranslationsProvider = ({ children }) => {
  const [translations, setTranslations] = React.useState()
  const [language, setLanguage] = React.useState()

  React.useEffect(() => {
    const defaultLanguage = detectUserLanguage()
    setLanguage(defaultLanguage)
  }, [])

  React.useEffect(() => {
    setTranslations(texts[language])
  }, [language])

  return (
    <LanguageContext.Provider value={[language, setLanguage]}>
      <TranslationsContext.Provider value={[translations, setTranslations]}>
        {children}
      </TranslationsContext.Provider>
    </LanguageContext.Provider>
  )
}

export default TranslationsProvider
