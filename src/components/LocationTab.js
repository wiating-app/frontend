import React from 'react'
import {
  Drawer,
  IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Close } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'


const LocationTab = ({
  closeLocationTab,
  isLocationTabOpen,
  children,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Drawer
      open={isLocationTabOpen}
      variant='persistent'
      anchor={matches ? 'left' : 'bottom'}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.toolbar} />
      <PerfectScrollbar>
        <div className={classes.mapSpacer} />
        <div className={classes.inner}>
          <IconButton
            size='small'
            className={classes.close}
            aria-label='close'
            onClick={() => closeLocationTab()}
          ><Close /></IconButton>
          {children}
        </div>
      </PerfectScrollbar>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    height: '100vh',
    boxShadow: theme.shadows[3],
    backgroundColor: 'transparent',
    [theme.breakpoints.up('sm')]: {
      width: theme.layout.locationTabWidth,
      height: '100%',
      marginTop: 0,
    },
  },
  drawer: {
    flexShrink: 0,
  },
  mapSpacer: {
    height: theme.layout.mobileMiniMapHeight,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    minHeight: `calc(100% - ${theme.layout.mobileMiniMapHeight}px)`,
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      boxShadow: theme.shadows[4],
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: '100%',
    },
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
}))

export default LocationTab
