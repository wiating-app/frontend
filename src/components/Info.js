import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'
import Modal from './Modal'
import Version from './Version'
import history from '../history'
import useConfig from '../utils/useConfig'

const Info = () => {
  const classes = useStyles()
  const { branding } = useConfig()

  const handleClose = () => {
    localStorage.setItem('seenInitialInfo', 'true')
    history.push('/')
  }

  return (
    <Modal onClose={handleClose} short id='cy-info'>
      <div className={classes.root}>
        <div className={classes.main}>
          <div>
            <img
              src={`${process.env.CUSTOMIZATION_URL}/logo.png`}
              srcSet={`${process.env.CUSTOMIZATION_URL}/logo@2x.png 2x`}
              className={classes.logo}
            />
            <Typography gutterBottom variant='body1' dangerouslySetInnerHTML={{ __html: branding.info }} />
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
            {branding.adminInfo &&
              <Typography className={classes.footerRight} variant='body2' component='div' >
                Administracja: <div dangerouslySetInnerHTML={{ __html: branding.adminInfo }} />
              </Typography>
            }
            {branding.legalInfo &&
              <Typography className={classes.footerRight} variant='body2' component='div'>
                Opiekun prawny: <div dangerouslySetInnerHTML={{ __html: branding.legalInfo }} />
              </Typography>
            }
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
      '& > *': {
        display: 'inline',
      },
    },
    '& img': {
      height: 30,
      display: 'inline-block',
      verticalAlign: 'middle',
      margin: '-5px 0 -8px 5px',
    },
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
