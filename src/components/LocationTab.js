import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  Drawer,
  IconButton,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Close } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useRecoilState } from 'recoil'
import { isLocationTabOpenState } from '../state'


const LocationTab = ({
  children,
  history,
  location: { pathname },
}) => {
  const coverMapOnMobile = pathname.startsWith('/search')
  const classes = useStyles(coverMapOnMobile)
  const theme = useTheme()
  const isNotSmartphone = useMediaQuery(theme.breakpoints.up('sm'))
  const [isLocationTabOpen] = useRecoilState(isLocationTabOpenState)

  return (
    <Drawer
      open={isLocationTabOpen}
      variant='persistent'
      anchor={isNotSmartphone ? 'left' : 'bottom'}
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.toolbar} />
      <PerfectScrollbar>
        <div className={classes.inner}>
          <IconButton
            size='small'
            className={classes.close}
            aria-label='close'
            onClick={() => history.push('/')}
          ><Close /></IconButton>
          {children}
        </div>
      </PerfectScrollbar>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    backgroundColor: 'transparent',
    borderTop: 'none',
    height: coverMapOnMobile =>
      `calc(100vh - ${(coverMapOnMobile ? 0 : theme.layout.mobileMiniMapHeight)}px)`,
    boxShadow: theme.shadows[14],
    [theme.breakpoints.up('sm')]: {
      width: theme.layout.locationTabWidth,
      height: '100% !important',
      boxShadow: theme.shadows[3],
    },
  },
  drawer: {
    flexShrink: 0,
  },
  toolbar: {
    [theme.breakpoints.up('sm')]: {
      ...theme.mixins.toolbar,
    },
  },
  inner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    minHeight: '100%',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      boxShadow: theme.shadows[4],
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

export default withRouter(LocationTab)
