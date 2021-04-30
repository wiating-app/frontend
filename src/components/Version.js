import React from 'react'
import { Typography } from '@material-ui/core'
import { HelpOutlineRounded } from '@material-ui/icons'
import InfoTooltip from './InfoTooltip'


const Version = () => {
  let name
  let info
  switch (window.location.hostname) {
    case 'beta.wiating.eu':
    case 'staging.wiating.eu':
      name = 'Wersja eksperymentalna'
      info = 'Wersja aplikacji to testów, zawierająca najnowsze funkcjonalności.'
      break
    case 'localhost':
      name = 'Localhost'
      info = 'Frontend serwowany lokalnie.'
      break
    default:
      name = 'Wersja stabilna'
      info = 'Wersja oficjalna, przetestowana przez społeczność użytkowników.'
      break
  }
  return (
    <Typography variant='caption'>
      {name} <InfoTooltip icon={HelpOutlineRounded}>{info}</InfoTooltip>
    </Typography>
  )
}

export default Version
