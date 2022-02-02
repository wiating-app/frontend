import { IconButton, Tooltip } from '@material-ui/core'

import { Directions } from '@material-ui/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'

const NavigateButton = ({ coords }) => {
  const { lat, lng } = coords
  const classes = useStyles()
  const { translations } = useLanguage()
  const link = isMobile
    ? `geo:${lat},${lng}`
    : `https://www.google.com/maps/dir/Current+Location/${lat},${lng}`

  return (
    <Tooltip title={translations.navigate} placement='bottom'>
      <IconButton
        size='small'
        component='a'
        href={link}
        target={isMobile ? '_self' : '_blank'}
      ><Directions className={classes.icon} /></IconButton>
    </Tooltip>
  )
}

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 16,
  },
}))

NavigateButton.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
}

export default NavigateButton
