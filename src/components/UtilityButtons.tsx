import { Directions, FileCopy, Share } from '@material-ui/icons'
import IconButton from './IconButton'
import { Tooltip } from './Tooltip'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import React from 'react'
import { isMobile } from 'react-device-detect'
import useLanguage from '../utils/useLanguage'
import { useSnackbar } from 'notistack'
import { locationToString } from '../utils/helpers'
import useConfig from '../utils/useConfig'

interface UtilityButtonsProps {
  id: string | number
  coords: {
    lat: number
    lng: number
  }
}

const UtilityButtons = ({ id, coords }: UtilityButtonsProps) => {
  const { lat, lng } = coords
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const { branding: { themeColor, secondaryColor } } = useConfig()

  const locationUrl = `${window.location.protocol}//${window.location.host}/location/${id}`
  const locationString = locationToString(coords)
  const navigateLink = isMobile
    ? `geo:${lat},${lng}`
    : `https://www.google.com/maps/dir/Current+Location/${lat},${lng}`

  const buttonStyle = {
    backgroundColor: secondaryColor || themeColor,
  }

  return (
    <div className="absolute left-0 right-0 -top-4 -m-2 flex items-center justify-center">
      <Tooltip content={translations.share}>
        <CopyToClipboard
          text={locationUrl}
          onCopy={() => enqueueSnackbar(translations.urlCopied, { variant: 'success' })}
        >
          <div>
            <IconButton size='small' className="text-white m-2 border-2 border-white" style={buttonStyle}>
              <Share className="scale-75" />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip content={translations.copyCoordinates}>
        <CopyToClipboard
          text={locationString}
          onCopy={() => enqueueSnackbar(translations.coordinatesCopied, { variant: 'success' })}
        >
          <div>
            <IconButton size='small' className="text-white m-2 border-2 border-white" style={buttonStyle}>
              <FileCopy className="scale-75" />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip content={translations.navigate}>
        <IconButton
          size='small'
          className="text-white m-2 border-2 border-white"
          style={buttonStyle}
          {...({ component: 'a' } as any)}
          href={navigateLink}
          target={isMobile ? '_self' : '_blank'}
        >
          <Directions />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default UtilityButtons
