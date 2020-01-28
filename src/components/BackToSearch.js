import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ViewList } from '@material-ui/icons'
import Text from './Text'

const BackToSearch = ({ onClick }) => {
  const classes = useStyles()
  return (
    <Button
      onClick={() => onClick()}
      className={classes.root}
      variant='contained'
      size='small'
    ><ViewList /> <Text id='backToResults' /></Button>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
  },
}))

export default BackToSearch
