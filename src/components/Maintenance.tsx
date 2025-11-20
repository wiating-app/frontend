import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const Maintenance = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography
        variant='h4'
        className={classes.heading}
      >W serwisie Wiating trwają właśnie prace serwisowe.</Typography>
      <Typography
        variant='h5'
        className={classes.subheading}
      >Spróbuj ponownie później.</Typography>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
  },
  heading: {
    marginBottom: theme.spacing(4),
    color: 'white',
  },
  subheading: {
    color: 'white',
  },
}))

export default Maintenance
