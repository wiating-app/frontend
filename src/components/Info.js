import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import Modal from './Modal'
import history from '../history'

const Info = () => {
  const classes = useStyles()

  const handleClose = () => {
    localStorage.setItem('seenInitialInfo', 'true')
    history.push('/')
  }

  return (
    <Modal onClose={handleClose}>
      <div className={classes.root}>
        <img
          src='/logo-full.png'
          srcSet='/logo-full@2x.png 2x'
          className={classes.logo}
        />
        <Typography variant='subtitle1' gutterBottom>
          Witaj na nowej mapie facebook'owej grupy <a href='https://www.facebook.com/groups/938290029559772' target='_blank'>Wiating czyli chatki w górach</a>!
        </Typography>
        <Typography variant='body2' gutterBottom>
         Aplikacja pyta o lokalizację w celu umiejscowienia kropki Twojego położenia. Nie wysyłamy nigdzie tej informacji.
        </Typography>
        <Typography variant='body2' gutterBottom>
          Aplikacja znajduje się aktualnie w fazie testów i jej zawartość jest tymczasowa.
        </Typography>
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={handleClose}
        >Przejdź do mapy</Button>
      </div>
    </Modal>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
  },
  logo: {
    maxWidth: '100%',
    margin: '0 auto 32px',
    display: 'block',
  },
  button: {
    marginTop: 32,
  }
}))

export default Info
