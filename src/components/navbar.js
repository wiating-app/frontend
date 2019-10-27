import React from 'react'
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import { ArrowDropDown, Search } from '@material-ui/icons'
import Form from 'react-standalone-form'
import { Input } from 'react-standalone-form-mui'
import { strings } from '../lang/strings.js'
import Dropdown from './Dropdown'


const NavBar = ({ user, logout, loginWithRedirect, onSearch }) => {
  const classes = useStyles()
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>Wiating</Typography>
        <div className={classes.searchWrapper}>
          <div className={classes.search}>
            <div className={classes.searchIcon}><Search /></div>
            <Form
              fields={['phrase']}
              callbackOnChange={fields => onSearch(fields.phrase)}
            >
              <Input
                name='phrase'
                placeholder='Szukaj'
                noBottomGutter
              />
            </Form>
          </div>
        </div>
        {user
          ? <Dropdown items={[
            { label: strings.auth.logout, onClick: () => logout() },
          ]}>
            <Avatar alt={user.name} src={user.picture}
            >{!user.picture && `${user.given_name.charAt(0)}${user.family_name.charAt(0)}`}</Avatar>
            <Typography className={classes.name}>{user.name && user.name}</Typography>
            <ArrowDropDown />
          </Dropdown>
          : <Button
            color='inherit'
            onClick={() => loginWithRedirect({})}
          >{strings.auth.login}</Button>
        }
      </Toolbar>
    </AppBar>
  )
}


const useStyles = makeStyles(theme => ({
  searchWrapper: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(7),
    maxWidth: 240,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    left: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginLeft: theme.spacing(1),
    textTransform: 'none',
  },
}))

export default NavBar
