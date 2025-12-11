import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import BackToSearch from '../components/BackToSearch'
import history from '../history'
import { Location } from '../typings'

const BackToSearchContainer = () => {
  const queryClient = useQueryClient()
  const cachedResults = queryClient.getQueryData<Location[]>(['searchResults'])

  const handleClick = () => {
    history.push('/search')
  }

  if (!cachedResults || !cachedResults.length) return null

  return <BackToSearch onClick={handleClick} />
}

export default BackToSearchContainer
