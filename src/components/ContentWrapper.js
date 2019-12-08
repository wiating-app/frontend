import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const ContentWrapper = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>{children}</div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    boxShadow: theme.shadows[1],
    position: 'relative',
    flexGrow: 1,
  },
}))

export default ContentWrapper
