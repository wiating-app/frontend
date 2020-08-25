import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { OpenInNew } from '@material-ui/icons'

const OpenInNewCard = ({ path, children }) => {
  const classes = useStyles()
  return (
    <Tooltip title='Przejdź do lokacji' placement='right'>
      <Link
        to={path}
        target='_blank'
        className={classes.link}
      >{children} <OpenInNew style={{ fontSize: 12 }} />
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
}))

export default OpenInNewCard
