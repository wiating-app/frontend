import React from 'react'
import { Modal as MUIModal, IconButton, Slide } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'
import history from '../history'


const Modal = ({ wide, short, small, children, onClose }) => {
  const classes = useStyles({ wide, short, small })

  return (
    <MUIModal
      onClose={() => onClose ? onClose() : history.goBack()}
      className={classes.root}
      disablePortal
      open
    >
      <>
        <div className={classes.toolbar} />
        <Slide direction='up' in mountOnEnter unmountOnExit>
          <PerfectScrollbar className={classes.content}>
            {children}
            <IconButton
              className={classes.close}
              onClick={() => onClose ? onClose() : history.goBack()}
            ><Close /></IconButton>
          </PerfectScrollbar>
        </Slide>
      </>
    </MUIModal>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    position: 'relative',
    width: ({ wide, small }) => wide ? 1200 : small ? 320 : 900,
    maxHeight: ({ small }) => small ? 160 : 'auto',
    marginTop: ({ short }) => short ? 30 : 0,
    marginBottom: ({ short }) => short ? 30 : 0,
    maxWidth: '100vw',
    flexGrow: 1,
    boxSizing: 'border-box',
    padding: theme.spacing(5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[50],
    overflow: 'hidden',
    '&:focus': {
      outline: 'none',
    },
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    // backgroundColor: 'rgba(255, 255, 255, 0.67)',
    // '&:hover': {
    //   backgroundColor: 'rgba(255, 255, 255, 0.9)',
    // },
  },
}))

export default Modal
