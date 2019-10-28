import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const Layout = ({ appBar, children }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      {appBar}
      <div className={classes.content}>
        {children}
      </div>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    flexGrow: 1,
    display: 'flex',
  },
}))

export default Layout
