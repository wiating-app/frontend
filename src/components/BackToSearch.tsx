import React from 'react'
import Button from './Button'
import { ViewList } from '@material-ui/icons'
import { useRecoilState } from 'recoil'
import useLanguage from '../utils/useLanguage'
import { searchResultsState, activeLocationState } from '../state'
import history from '../history'

const BackToSearch = () => {
  const [searchResults] = useRecoilState(searchResultsState)
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()

  if (!searchResults || !searchResults.length) return null
  return (
    <Button
      onClick={() => {
        history.push('/search')
        setActiveLocation(null)
      }}
      className="absolute top-4 left-4 z-10"
      variant='primary'
      size='small'
    ><ViewList /> {translations.backToResults}</Button>
  )
}

export default BackToSearch
