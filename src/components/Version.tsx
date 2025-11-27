import React from 'react'
import { HelpOutlineRounded } from '@material-ui/icons'
import { Tooltip } from './Tooltip'

const Version = () => {
  let name: string
  let info: string
  switch (window.location.hostname) {
    case 'beta.wiating.eu':
    case 'staging.wiating.eu':
      name = 'Wersja eksperymentalna'
      info = 'Wersja testowa, zawierająca najnowsze funkcjonalności'
      break
    case 'localhost':
      name = 'Localhost'
      info = 'Frontend serwowany lokalnie'
      break
    default:
      name = 'Wersja stabilna'
      info = 'Wersja oficjalna, przetestowana przez społeczność użytkowników'
      break
  }
  return (
    <Tooltip content={info} position="below" tooltipClassName="text-xs text-white">
    {name}{' '}
      <HelpOutlineRounded className="inline-block align-middle text-base" />
    </Tooltip>
  )
}

export default Version
