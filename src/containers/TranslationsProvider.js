import React from 'react'
import detectUserLanguage from '../utils/detectUserLanguage'
import texts from '../utils/texts'


export const TranslationsContext = React.createContext([null, () => {}])


const TranslationsProvider = ({ children }) => {
  const [translations, setTranslations] = React.useState()

  React.useEffect(() => {
    const lang = detectUserLanguage()
    setTranslations(texts[lang])
  }, [texts])

  return (
    <TranslationsContext.Provider value={[translations, setTranslations]}>
      {children}
    </TranslationsContext.Provider>
  )
}

export default TranslationsProvider
