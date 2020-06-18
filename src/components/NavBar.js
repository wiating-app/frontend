import React from 'react'
import { AppBar, Toolbar, Typography, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowDropDown, Menu } from '@material-ui/icons'
import Form from 'react-standalone-form'
import Dropdown from './Dropdown'
import Logo from './Logo'
import SearchInput from './SearchInput'
import Loader from './Loader'
import useLanguage from '../utils/useLanguage'


const NavBar = ({
  user,
  links,
  isLoggedIn,
  onSearch,
  searchLoading,
  authLoading,
  language,
  languages,
  setLanguage,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()

  return (
    <AppBar position='relative' className={classes.root}>
      <Toolbar>
        <Logo className={classes.logo} />
        <Form
          fields={['phrase']}
          onChange={fields => onSearch(fields.phrase)}
          className={classes.search}
        >
          <SearchInput
            name='phrase'
            placeholder={translations.search}
            noBottomGutter
            loading={searchLoading}
          />
        </Form>
        <div className={classes.grow} />
        {!authLoading && !isLoggedIn &&
          <Dropdown
            items={languages.map(lang => ({
              label: lang.toUpperCase(),
              callback: () => setLanguage(lang),
            }))}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >{language ? language.toUpperCase() : ''}</Dropdown>
        }
        {authLoading
          ? <Loader />
          : <Dropdown items={links}>
            {isLoggedIn
              ? <>
                <Avatar alt={user.name} src={user.picture}>
                  {!user.picture && `${user.given_name.charAt(0)}${user.family_name.charAt(0)}`}
                </Avatar>
                <Typography className={classes.name}>{user.name && user.name}</Typography>
                <ArrowDropDown />
              </>
              : <Menu />
            }
          </Dropdown>
        }
      </Toolbar>
    </AppBar>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  logo: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  search: {
    [theme.breakpoints.down('xs')]: {
      width: 190,
    },
  },
  name: {
    marginLeft: theme.spacing(1),
    textTransform: 'none',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
}))

export default NavBar
