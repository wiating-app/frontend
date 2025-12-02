import React from 'react'
import { activeTypesState } from '../state'
import classNames from 'classnames'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
import { useRecoilState } from 'recoil'

interface LegendProps {
  boxed?: boolean
}

const Legend = ({ boxed = false }: LegendProps) => {
  const [activeTypes, setActiveTypes] = useRecoilState(activeTypesState)
  const { translations, language } = useLanguage()
  const { locationTypes } = useConfig()

  const handleOnClick = (key: string | number) => {
    if (activeTypes.includes(key) && activeTypes.length) {
      setActiveTypes(activeTypes.filter(item => item !== key))
    } else {
      setActiveTypes([
        ...activeTypes,
        key,
      ])
    }
  }

  return (
    <div
      className={classNames(
        'rounded min-w-[168px]',
        {
          'bg-white/85 pt-2 pb-2': boxed,
          'bg-transparent': !boxed,
        }
      )}
    >
      <div
        className={classNames(
          {
            'pl-2 pb-1': boxed,
            'pl-0 pb-2': !boxed,
          }
        )}
      >
        <span className={boxed ? 'text-sm font-medium' : 'text-2xl font-medium'}>
          {translations.legend}
        </span>
      </div>
      {locationTypes.map(({ id, label }) => {
        const isActive = activeTypes.includes(id) || !activeTypes.length
        return (
          <div
            key={id}
            className={classNames(
              'flex items-center cursor-pointer hover:bg-white',
              boxed ? 'py-2 pl-2 pr-2 text-xs' : 'pt-2 pb-2 pl-0 pr-0 text-base',
              isActive ? 'text-gray-900 opacity-100' : 'text-gray-500 opacity-50'
            )}
            onClick={() => handleOnClick(id)}
          >
            <div
              dangerouslySetInnerHTML={{ __html: generateMarkerIcon(id, boxed ? 24 : 30) }}
              className="mr-1.5 -my-1.5"
            />
            <span>{label[language]}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Legend
