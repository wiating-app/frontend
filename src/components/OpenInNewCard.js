import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { OpenInNew } from '@material-ui/icons'

const OpenInNewCard = ({ path, children, component, ...otherProps }) => {
  const classes = useStyles()
  return (
    <Tooltip title='Przejdź do lokacji' placement='right'>
      <Link
        to={path}
        component={component}
        target='_blank'
        className={!component && classes.link}
        {...otherProps}
      >{children} <OpenInNew className={classes.icon} />
      </Link>
    </Tooltip>
  )
}

const useStyles = makeStyles(theme => ({
  link: {
    cursor: 'pointer',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  icon: {
    fontSize: 12,
    marginLeft: theme.spacing(0.5),
  },
}))

export default OpenInNewCard
