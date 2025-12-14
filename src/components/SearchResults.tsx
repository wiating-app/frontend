import React from 'react'
import { Location } from '../typings'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'
import Chip from './Chip'

interface SearchResultsProps {
  searchResults?: Location[]
  onLocationClick: (item: Location) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, onLocationClick }) => {
  const { translations } = useLanguage()
  return (
    <ul className="m-0 list-none p-0">
      {searchResults && searchResults.length ? (
        searchResults.map((item, index) => (
          <React.Fragment key={index}>
            <li
              className="flex cursor-pointer items-center p-4 hover:bg-gray-100"
              onClick={() => onLocationClick(item)}
            >
              <div className="mr-4">
                <div dangerouslySetInnerHTML={{ __html: generateMarkerIcon(item.type) }} className="h-11 w-11" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  {item.is_disabled ? (
                    <Chip size="small" color="secondary" label={translations.isDisabled} />
                  ) : (
                    item.description && item.description.substring(0, 70)
                  )}
                </div>
              </div>
            </li>
            <hr className="ml-16 border-t border-gray-200" />
          </React.Fragment>
        ))
      ) : (
        <div className="p-4 text-center text-base font-medium">{translations.noResults}</div>
      )}
    </ul>
  )
}

export default SearchResults
