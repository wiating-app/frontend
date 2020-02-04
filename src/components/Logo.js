import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const Logo = ({ className }) => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className || ''}`}>
      <img
        src='/logo-app.png'
        srcSet='/logo-app@2x.png 2x'
        title='Wiating'
        alt='Wiating'
      />
      <img
        src='/logo-app-typo.png'
        srcSet='/logo-app-typo@2x.png 2x'
        className={classes.typo}
      />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  typo: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

export default Logo
