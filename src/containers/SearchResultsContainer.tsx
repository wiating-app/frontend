import React from 'react'
import SearchResults from '../components/SearchResults'
import history from '../history'
import { activeLocationState } from '../state'
import { Location } from '../typings'
import useLanguage from '../utils/useLanguage'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilState } from 'recoil'
import { toast } from 'sonner'

const SearchResultsContainer = () => {
  const queryClient = useQueryClient()
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const { translations } = useLanguage()
  const cachedResults = queryClient.getQueryData<Location[]>(['searchResults'])

  // Redirect to home if page is refreshed (no cached search results)
  React.useEffect(() => {
    if (!cachedResults || cachedResults.length === 0) {
      history.replace('/')
    }
    if (cachedResults?.length === 0) {
      toast.error(translations.noResults)
    }
  }, [cachedResults, translations])

  const handleLocationClick = (item: Location) => {
    setActiveLocation(item)
    history.push(`/location/${item.id}`)
  }

  // Don't render if no results (will redirect)
  if (!cachedResults || cachedResults.length === 0) {
    return null
  }

  return <SearchResults searchResults={cachedResults} onLocationClick={handleLocationClick} />
}
export default SearchResultsContainer
