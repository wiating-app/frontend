import { IconButton, Tooltip } from '@material-ui/core'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FileCopy } from '@material-ui/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'
import { useSnackbar } from 'notistack'

const CopyCoordsButton = ({ lat, lng }) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const coords = `${lat},${lng}`

  return (
    <Tooltip title={translations.copyCoordinates} placement='bottom'>
      <CopyToClipboard
        text={coords}
        onCopy={() => enqueueSnackbar(translations.notifications.coordinatesCopied, { variant: 'success' })}
      ><IconButton size='small'><FileCopy className={classes.icon} /></IconButton>
      </CopyToClipboard>
    </Tooltip>
  )
}

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 15,
  },
}))

CopyCoordsButton.propTypes = {
  coords: PropTypes.shape({
    lat: PropTypes.string,
    lng: PropTypes.string,
  }),
}

export default CopyCoordsButton
