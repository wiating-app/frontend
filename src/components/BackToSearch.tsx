import React from 'react'
import useLanguage from '../utils/useLanguage'
import Button from './Button'
import { List } from 'lucide-react'

interface BackToSearchProps {
  onClick: () => void
}

const BackToSearch: React.FC<BackToSearchProps> = ({ onClick }) => {
  const { translations } = useLanguage()

  return (
    <Button onClick={onClick} className="absolute left-14 top-2 z-10" variant="primary" size="small">
      <List size={20} /> {translations.backToResults}
    </Button>
  )
}

export default BackToSearch
