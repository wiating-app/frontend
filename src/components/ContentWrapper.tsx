import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

interface ContentWrapperProps {
  children: React.ReactNode
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
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
    [theme.breakpoints.down('xs')]: {
      paddingRight: theme.spacing(3),
    },
  },
}))

export default ContentWrapper

