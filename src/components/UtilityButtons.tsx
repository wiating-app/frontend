import React from 'react'
import { Link, Locate, Navigation } from 'lucide-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { isMobile } from 'react-device-detect'
import { toast } from 'sonner'
import { locationToString } from '../utils/helpers'
import useLanguage from '../utils/useLanguage'
import IconButton from './IconButton'
import { Tooltip } from './Tooltip'

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

  const locationUrl = `${window.location.protocol}//${window.location.host}/location/${id}`
  const locationString = locationToString(coords)
  const navigateLink = isMobile ? `geo:${lat},${lng}` : `https://www.google.com/maps/dir/Current+Location/${lat},${lng}`

  return (
    <div className="absolute -top-2.5 left-0 right-0 -m-2 flex items-center justify-center space-x-3">
      <Tooltip content={translations.share} delay={200} desktopOnly>
        <CopyToClipboard text={locationUrl} onCopy={() => toast(translations.urlCopied)}>
          <div>
            <IconButton variant="bordered">
              <Link size={17} strokeWidth={2.5} />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip content={translations.copyCoordinates} delay={200} desktopOnly>
        <CopyToClipboard text={locationString} onCopy={() => toast(translations.coordinatesCopied)}>
          <div>
            <IconButton variant="bordered">
              <Locate size={18} strokeWidth={2.5} />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip content={translations.navigate} delay={200} desktopOnly>
        <IconButton variant="bordered" href={navigateLink} target={isMobile ? '_self' : '_blank'}>
          <Navigation size={17} strokeWidth={2.5} />
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default UtilityButtons
