import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useConfig from '../utils/useConfig'

const Logo = ({ className }) => {
  const classes = useStyles()
  const { branding } = useConfig()

  return (
    <div className={`${classes.root} ${className || ''}`}>
      <img
        src={`${process.env.CUSTOMIZATION_URL}/purelogo.png`}
        srcSet={`${process.env.CUSTOMIZATION_URL}/purelogo@2x.png 2x`}
        alt={branding.siteName}
      />
      <img
        src={`${process.env.CUSTOMIZATION_URL}/logotype.png`}
        srcSet={`${process.env.CUSTOMIZATION_URL}/logotype@2x.png 2x`}
        className={classes.typo}
        alt=''
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
