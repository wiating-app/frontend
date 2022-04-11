import {
  IconButton,
  Drawer as MUIDrawer,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import { Close } from '@material-ui/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import React from 'react'
import { isDrawerOpenState } from '../state'
import useKeyPress from '../utils/useKeyPress'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useRecoilState } from 'recoil'
import { withRouter } from 'react-router-dom'

const Drawer = ({
  children,
  history,
  location: { pathname },
}) => {
  const coverMapOnMobile = pathname.startsWith('/search')
  const classes = useStyles(coverMapOnMobile)
  const theme = useTheme()
  const isNotSmartphone = useMediaQuery(theme.breakpoints.up('sm'))
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)

  const handleOnClose = () => history.push('/')

  useKeyPress('Escape', () => {
    handleOnClose()
  })

  return (
    <MUIDrawer
      open={isDrawerOpen}
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
    </MUIDrawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    borderTop: 'none',
    borderRight: 'none',
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

export default withRouter(Drawer)
