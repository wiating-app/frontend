import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import Modal from './Modal'
import Version from './Version'
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
        <div className={classes.main}>
          <div>
            <img
              src='/logo-full.png'
              srcSet='/logo-full@2x.png 2x'
              className={classes.logo}
            />
            <Typography gutterBottom variant='body1'>
              Witaj w aplikacji grupy facebookowej <br/><a href='https://www.facebook.com/groups/938290029559772' target='_blank'>Wiating czyli chatki w górach</a>!
            </Typography>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              onClick={handleClose}
              size='large'
            >Przejdź do mapy</Button>
            <div className={classes.version}><Version /></div>
          </div>
        </div>
        <div className={classes.footer}>
          <Typography className={classes.footerLeft} variant='body2' >
            Twórcy aplikacji:<br />
            <a href='https://github.com/firflant' target='_blank' >Michał Kokociński</a>, <a href='https://github.com/merito' target='_blank' >Dawid Wolski</a></Typography>
          <div>
            <Typography className={classes.footerRight} variant='body2' component='div'>
              Administracja:
              <div style={{ marginLeft: 4 }}>
                Dariusz Hajduk (<a href='mailto:wiating@wiating.eu'>wiating@wiating.eu</a>)
              </div>
            </Typography>
            <div className={classes.partner}>
              <Typography className={classes.footerRight} variant='body2' component='div'>
                Opiekun prawny:
                <div style={{ marginLeft: 4 }}>
                  Weronika Bednarska
                  <a href='https://soinlaw.com' target='_blank'>
                    <img
                      src='/soinlaw.png'
                      alt='SO IN LAW'
                      title='SO IN LAW'
                      className={classes.partnerLogo}
                    />
                  </a>
                </div>
              </Typography>
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
    '& a': {
      color: 'inherit',
    },
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: theme.palette.grey[800],
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  footerLeft: {
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },
  footerRight: {
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
      display: 'flex',
    },
  },
  partner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerLogo: {
    width: 86,
    display: 'inline-block',
    verticalAlign: 'middle',
    margin: '-5px 0 -8px 5px',
  },
  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  version: {
    margin: '0 auto 18px',
  },
}))

export default Info
