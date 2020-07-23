import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import { Share } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useLanguage from '../utils/useLanguage'


const ShareButton = ({ id }) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const { enqueueSnackbar } = useSnackbar()
  const locationUrl = `${window.location.protocol}//${window.location.host}/location/${id}`

  return (
    <Tooltip title={translations.share} placement='bottom'>
      <CopyToClipboard
        text={locationUrl}
        onCopy={() => enqueueSnackbar(translations.notifications.urlCopied, { variant: 'success' })}
      ><IconButton size='small'><Share className={classes.icon} /></IconButton>
      </CopyToClipboard>
    </Tooltip>
  )
}

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 15,
  },
}))

export default ShareButton
