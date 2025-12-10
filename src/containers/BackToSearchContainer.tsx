import React from 'react'
import BackToSearch from '../components/BackToSearch'
import history from '../history'
import { activeLocationState } from '../state'
import { Location } from '../typings'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'

const BackToSearchContainer = () => {
  const queryClient = useQueryClient()
  const cachedResults = queryClient.getQueryData<Location[]>(['searchResults'])
  const [, setActiveLocation] = useRecoilState(activeLocationState)

  const handleClick = () => {
    history.push('/search')
    setActiveLocation(null)
  }

  if (!cachedResults || !cachedResults.length) return null

  return <BackToSearch onClick={handleClick} />
}

export default BackToSearchContainer
