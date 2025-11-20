import React from 'react'
import translationsFile from './translations'
import detectUserLanguage from './detectUserLanguage'
import useConfig from './useConfig'

// Translations type that allows any string key access
// This prevents TypeScript errors when accessing translation properties
// Since translations come from a JSON file with many keys, we use Record type
// to allow any string property access without TypeScript errors
export type Translations = Record<string, any> & {
  id: string
}

interface LanguageContextType {
  translations: Translations | null
  setLanguage: (language: string) => void
}

export const LanguageContext = React.createContext<LanguageContextType>({
  translations: null,
  setLanguage: () => {},
})

interface LanguageProviderProps {
  children: React.ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [translations, setTranslations] = React.useState<Translations | null>(null)
  const { translations: customTranslations = {} } = useConfig() || {}

  const setLanguage = (language: string) => {
    setTranslations({
      ...translationsFile[language],
      ...customTranslations[language],
      id: language,
    })
    localStorage.setItem('language', language)
  }

  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language')
    setLanguage((storedLanguage && Object.keys(translationsFile).includes(storedLanguage))
      ? storedLanguage
      : detectUserLanguage()
    )
  }, [])

  return (
    <LanguageContext.Provider value={{ translations, setLanguage }}>
      {translations && children}
    </LanguageContext.Provider>
  )
}

interface UseLanguageReturn {
  translations: Translations | null
  language: string | undefined
  setLanguage: (language: string) => void
  languages: string[]
}

const useLanguage = (): UseLanguageReturn => {
  const { translations, setLanguage } = React.useContext(LanguageContext)
  return {
    translations: translations as Translations | null,
    language: translations?.id,
    setLanguage,
    languages: Object.keys(translationsFile),
  }
}

export default useLanguage

