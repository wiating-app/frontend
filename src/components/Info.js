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
    <Modal onClose={handleClose} short>
      <div className={classes.root}>
        <div>
          <img
            src='/logo-full.png'
            srcSet='/logo-full@2x.png 2x'
            className={classes.logo}
          />
          <Typography gutterBottom variant='body1'>
            Witaj w aplikacji grupy facebookowej <a href='https://www.facebook.com/groups/938290029559772' target='_blank'>Wiating czyli chatki w górach</a>!
          </Typography>
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            onClick={handleClose}
            size='large'
          >Przejdź do mapy</Button>
        </div>
        <div className={classes.footer}>
          <Typography className={classes.footerLeft} variant='body2'>
            Twórcy aplikacji:<br />
            <a href='https://github.com/frontcraft' target='_blank' >Michał Kokociński</a>, <a href='https://github.com/merito' target='_blank' >Dawid Wolski</a></Typography>
          <div>
            <Typography className={classes.footerRight} variant='body2'>
              Administracja: Dariusz Hajduk (<a href='mailto:wiating@wiating.eu'>wiating@wiating.eu</a>)
            </Typography>
            <div className={classes.partner}>
              <Typography className={classes.footerRight} variant='body2'>
                Opiekun prawny: Weronika Bednarska
              </Typography>
              <a href='https://soinlaw.com' target='_blank'>
                <img
                  src='/soinlaw.png'
                  alt='SO IN LAW'
                  title='SO IN LAW'
                  className={classes.partnerLogo}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& a': {
      color: 'inherit',
    },
  },
  logo: {
    maxWidth: '100%',
    margin: '0 auto 34px',
    display: 'block',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  [theme.breakpoints.up('sm')]: {
    footerLeft: {
      textAlign: 'left',
    },
    footerRight: {
      textAlign: 'right',
    },
  },
  partner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerLogo: {
    width: 86,
    display: 'block',
    margin: '-2px 0 -2px 6px',
  },
  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
}))

export default Info
