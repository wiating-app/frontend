import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useConfig from '../utils/useConfig'

const Logo = ({ className }) => {
  const classes = useStyles()
  const { branding } = useConfig()

  return (
    <div className={`${classes.root} ${className || ''}`}>
      <img
        src={branding.purelogo[0]}
        srcSet={`${branding.purelogo[1]} 2x`}
        title='Wiating'
        alt='Wiating'
      />
      <img
        src={branding.logotype[0]}
        srcSet={`${branding.logotype[1]} 2x`}
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
