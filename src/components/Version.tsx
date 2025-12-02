import React from 'react'
import classNames from 'classnames'
import { HelpCircle } from 'lucide-react'
import { Tooltip } from './Tooltip'

interface VersionProps {
  dark?: boolean
  className?: string
}

const Version = ({ dark = false, className }: VersionProps) => {
  let name: string
  let info: string
  switch (window.location.hostname) {
    case 'beta.wiating.eu':
    case 'staging.wiating.eu':
      name = 'Wersja eksperymentalna'
      info = 'Wersja testowa, zawierająca najnowsze funkcjonalności'
      break
    case 'localhost':
      name = 'Wersja lokalna'
      info = 'Frontend serwowany lokalnie'
      break
    default:
      name = 'Wersja stabilna'
      info = 'Wersja oficjalna, przetestowana przez społeczność użytkowników'
      break
  }
  return (
    <Tooltip content={info} anchor="right-center" tooltipClassName={classNames(
      'text-xs cursor-help',
      dark ? 'text-gray-800' : 'text-white',
      className,
    )}>
      {name}{' '}
      <HelpCircle className="inline-block align-middle" size={16} />
    </Tooltip>
  )
}

export default Version
