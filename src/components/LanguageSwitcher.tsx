import React from 'react'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import Heading from './Heading'
import Modal from './Modal'
import { toast } from 'sonner'

interface LanguageSwitcherProps {
  language: string
  languages: string[]
  setLanguage: (lang: string) => void
  onClose: () => void
}

const LanguageSwitcher = ({ language, languages, setLanguage, onClose }: LanguageSwitcherProps) => {
  const { translations } = useLanguage()
  return (
    <Modal small onClose={onClose}>
      <div className="text-center">
        <Heading level={6} gutterBottom>
          {translations.selectLanguage}:
        </Heading>
        {languages.map(item => (
          <Button
            onClick={() => {
              onClose()
              setLanguage(item)
              toast.success(translations.languageChanged)
            }}
            variant={item === language ? 'primary' : 'bare'}
            disabled={item === language}
            key={item}
          >
            {item.toUpperCase()}
          </Button>
        ))}
      </div>
    </Modal>
  )
}

export default LanguageSwitcher
