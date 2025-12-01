import React from 'react'
import Heading from './Heading'
import Button from './Button'
import { useSnackbar } from 'notistack'
import Modal from './Modal'
import useLanguage from '../utils/useLanguage'


interface LanguageSwitcherProps {
  language: string
  languages: string[]
  setLanguage: (lang: string) => void
  onClose: () => void
}

const LanguageSwitcher = ({
  language,
  languages,
  setLanguage,
  onClose,
}: LanguageSwitcherProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { translations } = useLanguage()
  return (
    <Modal small onClose={onClose}>
      <div className="text-center">
        <Heading level={6} gutterBottom>{translations.selectLanguage}:</Heading>
        {languages.map(item =>
          <Button
            onClick={() => {
              onClose()
              setLanguage(item)
              enqueueSnackbar(translations.languageChanged, { variant: 'success' })
            }}
            variant={item === language ? 'primary' : 'bare'}
            disabled={item === language}
            key={item}
          >{item.toUpperCase()}</Button>
        )}
      </div>
    </Modal>
  )
}

export default LanguageSwitcher
