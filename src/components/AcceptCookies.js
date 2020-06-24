import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import Cookies from 'js-cookie'

const AcceptCookies = () => {
  const classes = useStyles()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!Cookies.get('acceptCookies')) {
      setIsVisible(true)
    }
  }, [])

  return isVisible
    ? <div className={classes.root}>
      <Typography variant='body2' className={classes.text}>
        Serwis wykorzystuje pliki cookies. Korzystając ze strony wyrażasz zgodę na wykorzystywanie plików cookies.
      </Typography>
      <div className={classes.buttons}>
        <Button
          size='small'
          className={classes.button}
          component={Link}
          to='/cookies'
        >Dowiedz się więcej</Button>
        <Button
          size='small'
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => {
            setIsVisible(false)
            Cookies.set('acceptCookies', 'true')
          }}
        >Rozumiem</Button>
      </div>
    </div>
    : null
}


const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 'auto',
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: theme.shadows[20],
    zIndex: theme.zIndex.snackbar,
    backgroundColor: 'white',
    boxSizing: 'border-box',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  text: {
    marginRight: theme.spacing(4),
    maxWidth: 830,
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      marginBottom: theme.spacing(2),
      marginRight: 0,
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(-1),
  },
  button: {
    margin: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
}))

export default AcceptCookies
