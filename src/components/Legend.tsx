import React, { useState } from 'react'
import { activeTypesState } from '../state'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import useMediaQuery from '../utils/useMediaQuery'
import { Tooltip } from './Tooltip'
import classNames from 'classnames'
import { ChevronDown, ChevronUp, Undo2 } from 'lucide-react'
import { useRecoilState } from 'recoil'

const Legend = () => {
  const [activeTypes, setActiveTypes] = useRecoilState(activeTypesState)
  const { isPhone } = useMediaQuery()
  const [isExpanded, setIsExpanded] = useState(!isPhone)
  const { translations, language } = useLanguage()
  const { locationTypes } = useConfig()

  const handleOnClick = (key: string | number) => {
    if (activeTypes.includes(key) && activeTypes.length) {
      setActiveTypes(activeTypes.filter(item => item !== key))
    } else {
      setActiveTypes([...activeTypes, key])
    }
  }

  return (
    <div className="rounded bg-white/85 py-1 sm:min-w-[168px] sm:py-2">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={classNames(
          'flex cursor-pointer items-center justify-between gap-2 px-2',
          isExpanded && 'border-b border-gray-200 pb-1 sm:pb-2',
        )}
      >
        <div className="flex items-center gap-1">
          <span className={classNames('text-sm', isExpanded && 'font-medium')}>
            {translations.legend}
            {activeTypes.length > 0 && <span className="ml-1">({activeTypes.length})</span>}
          </span>
          {isExpanded && activeTypes.length > 0 && (
            <Tooltip content={translations.reset} anchor="bottom-center">
              <button
                onClick={e => {
                  e.stopPropagation()
                  setActiveTypes([])
                }}
                className={classNames(
                  'cursor-pointer border-0 bg-transparent p-0',
                  'opacity-50 hover:opacity-100',
                  'transition-colors',
                  'translate-y-0.5',
                )}
              >
                <Undo2 size={16} />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="text-gray-700">
          {isExpanded ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
        </div>
      </div>
      {isExpanded &&
        locationTypes.map(({ id, label }) => {
          const isActive = activeTypes.includes(id) || !activeTypes.length
          return (
            <div
              key={id}
              className={classNames(
                'flex cursor-pointer items-center py-2 pl-2 pr-2 text-xs hover:bg-white',
                isActive ? 'text-gray-900 opacity-100' : 'text-gray-500 opacity-50',
              )}
              onClick={() => handleOnClick(id)}
            >
              <div dangerouslySetInnerHTML={{ __html: generateMarkerIcon(id, 24) }} className="-my-1.5 mr-1.5" />
              <span>{label[language]}</span>
            </div>
          )
        })}
    </div>
  )
}

export default Legend
