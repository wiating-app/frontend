import { Directions, FileCopy, Share } from '@material-ui/icons'
import { IconButton, Tooltip } from '@material-ui/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'
import React from 'react'
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
      <Tooltip title={translations.share} placement='top'>
        <CopyToClipboard
          text={locationUrl}
          onCopy={() => enqueueSnackbar(translations.notifications.urlCopied, { variant: 'success' })}
        >
          <div>
            <IconButton size='small' className={classes.button}>
              <Share className={classes.smallerIcon} />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip title={translations.copyCoordinates} placement='top'>
        <CopyToClipboard
          text={coords}
          onCopy={() => enqueueSnackbar(translations.notifications.coordinatesCopied, { variant: 'success' })}
        >
          <div>
            <IconButton size='small' className={classes.button}>
              <FileCopy className={classes.smallerIcon} />
            </IconButton>
          </div>
        </CopyToClipboard>
      </Tooltip>
      <Tooltip title={translations.navigate} placement='top'>
        <IconButton
          size='small'
          className={classes.button}
          component='a'
          href={navigateLink}
          target={isMobile ? '_self' : '_blank'}
        >
          <Directions />
        </IconButton>
      </Tooltip>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -theme.spacing(2),
    margin: -theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    margin: theme.spacing(1),
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  smallerIcon: {
    transform: 'scale(0.8)',
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
