import React from 'react'
import Button from './Button'
import { List } from 'lucide-react'
import useLanguage from '../utils/useLanguage'

interface BackToSearchProps {
  onClick: () => void
}

const BackToSearch: React.FC<BackToSearchProps> = ({ onClick }) => {
  const { translations } = useLanguage()

  return (
    <Button
      onClick={onClick}
      className="absolute top-2 left-14 z-10"
      variant='primary'
      size='small'
    ><List size={20} /> {translations.backToResults}</Button>
  )
}

export default BackToSearch
