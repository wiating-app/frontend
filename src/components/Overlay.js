import React from 'react'
import { Modal, IconButton, Slide } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import history from '../history'


const Overlay = ({ children }) => {
  const classes = useStyles()

  return (
    <Modal
      onClose={() => history.goBack()}
      className={classes.root}
      disablePortal
      open
    >
      <>
        <div className={classes.toolbar} />
        <Slide direction='up' in mountOnEnter unmountOnExit>
          <div className={classes.content}>
            {children}
            <IconButton
              className={classes.close}
              onClick={() => history.goBack()}
            ><Close /></IconButton>
          </div>
        </Slide>
      </>
    </Modal>
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
    width: 800,
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

export default Overlay
