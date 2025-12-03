import React from 'react'
import Chip from './Chip'
import useLanguage from '../utils/useLanguage'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import { Location } from '../typings'

interface SearchResultsProps {
  searchResults?: Location[]
  onLocationClick: (item: Location) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, onLocationClick }) => {
  const { translations } = useLanguage()
  return (
    <ul className="list-none p-0 m-0">
      {searchResults && searchResults.length
        ? searchResults.map((item, index) =>
          <React.Fragment key={index}>
            <li
              className="flex items-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => onLocationClick(item)}
            >
              <div className="mr-4">
                <div
                  dangerouslySetInnerHTML={{ __html: generateMarkerIcon(item.type) }}
                  className="w-11 h-11"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">
                  {item.is_disabled
                    ? <Chip
                      size='small'
                      color='secondary'
                      label={translations.isDisabled}
                    />
                    : item.description && item.description.substring(0, 70)
                  }
                </div>
              </div>
            </li>
            <hr className="border-t border-gray-200 ml-16" />
          </React.Fragment>
        )
        : <div className="text-base font-medium text-center p-4">{translations.noResults}</div>
      }
    </ul>
  )
}

export default SearchResults
