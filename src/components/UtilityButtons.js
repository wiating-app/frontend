import { Directions, FileCopy, Share } from '@material-ui/icons'
import { IconButton, Tooltip } from '@material-ui/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { isMobile } from 'react-device-detect'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'
import { useSnackbar } from 'notistack'

const UtilityButtons = ({ id, coords }) => {
  const { lat, lng } = coords
  const classes = useStyles()
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()

  const locationUrl = `${window.location.protocol}//${window.location.host}/location/${id}`
  const navigateLink = isMobile
    ? `geo:${lat},${lng}`
    : `https://www.google.com/maps/dir/Current+Location/${lat},${lng}`

  return (
    <div className={classes.root}>
      <Tooltip title={translations.share} placement='bottom'>
        <CopyToClipboard
          text={locationUrl}
          onCopy={() => enqueueSnackbar(translations.notifications.urlCopied, { variant: 'success' })}
        >
          <IconButton size='small'><Share className={classes.icon} /></IconButton>
        </CopyToClipboard>
      </Tooltip>
      {' '}
      <Tooltip title={translations.copyCoordinates} placement='bottom'>
        <CopyToClipboard
          text={coords}
          onCopy={() => enqueueSnackbar(translations.notifications.coordinatesCopied, { variant: 'success' })}
        >
          <IconButton size='small'><FileCopy className={classes.icon} /></IconButton>
        </CopyToClipboard>
      </Tooltip>
      {' '}
      <Tooltip title={translations.navigate} placement='bottom'>
        <IconButton
          size='small'
          component='a'
          href={navigateLink}
          target={isMobile ? '_self' : '_blank'}
        >
          <Directions className={classNames(classes.icon, classes.biggerIcon)} />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: -2,
    marginBottom: 4,
  },
  icon: {
    fontSize: 24,
    color: theme.palette.grey[500],
    '&:hover': {
      color: theme.palette.grey[600],
    },
  },
  biggerIcon: {
    fontSize: 26,
  },
}))

UtilityButtons.propTypes = {
  id: PropTypes.string,
  coords: PropTypes.shape({
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
}

export default UtilityButtons
