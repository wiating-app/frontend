import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import {
  Drawer,
  Button,
  IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Close, ViewList } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'


const LocationTab = ({
  closeLocationTab,
  backToSearch,
  children,
  location,
  history,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Drawer
      open={location.pathname.startsWith('/location') || location.pathname.startsWith('/search')}
      variant='persistent'
      anchor={matches ? 'left' : 'bottom'}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      onClose={() => closeLocationTab()}
    >
      <div className={classes.toolbar} />
      <PerfectScrollbar className={classes.inner}>
        <IconButton
          size='small'
          className={classes.close}
          aria-label='close'
          component={Link}
          to='/'
        ><Close /></IconButton>

        {backToSearch &&
          <Button
            onClick={() => backToSearch()}
            className={classes.backToSearch}
            variant='contained'
            size='small'
          ><ViewList /> Powrót do wyników</Button>
        }

        {children}
      </PerfectScrollbar>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    height: '100vh',
    boxShadow: theme.shadows[3],
    [theme.breakpoints.up('sm')]: {
      width: 400,
      height: '100%',
      marginTop: 0,
    },
  },
  drawer: {
    flexShrink: 0,
  },
  toolbar: theme.mixins.toolbar,
  inner: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
    backgroundColor: 'rgba(255, 255, 255, 0.67)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  backToSearch: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    zIndex: theme.zIndex.mobileStepper,
  },
}))

export default withRouter(LocationTab)
